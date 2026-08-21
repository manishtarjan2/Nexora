import math
import pg8000.native
import os
import re
from collections import Counter
from urllib.parse import urlparse

class FeatureGenerator:
    def __init__(self):
        self.db_url = os.environ.get("DATABASE_URL", "postgresql://user:password@localhost:5432/nexora_db")
        self.videos_cache = []
        self.tfidf_matrix = [] # List of dicts mapping word to tf-idf score
        self.idf = {}
        self.vocab = set()
        self._refresh_cache()

    def _tokenize(self, text):
        if not text:
            return []
        text = str(text).lower()
        words = re.findall(r'\b[a-z]{3,}\b', text)
        stop_words = {'the', 'and', 'for', 'with', 'this', 'that', 'from', 'but', 'not'}
        return [w for w in words if w not in stop_words]

    def _refresh_cache(self):
        try:
            url = urlparse(self.db_url)
            conn = pg8000.native.Connection(
                user=url.username or 'user',
                password=url.password or 'password',
                host=url.hostname or 'localhost',
                port=url.port or 5432,
                database=url.path[1:] if url.path else 'nexora_db'
            )
            
            rows = conn.run("SELECT id, title, description FROM \"Video\"")
            
            videos = []
            for r in rows:
                videos.append({"id": r[0], "title": r[1], "description": r[2]})
            
            if len(videos) == 0:
                self.videos_cache = []
                self.tfidf_matrix = []
                return
                
            self.videos_cache = videos
            
            # Compute TF-IDF in pure Python
            N = len(videos)
            doc_tfs = []
            doc_freqs = Counter()
            
            for v in videos:
                content = f"{v['title']} {v.get('description', '')}"
                words = self._tokenize(content)
                tf = Counter(words)
                doc_tfs.append(tf)
                for w in set(words):
                    doc_freqs[w] += 1
                    
            self.idf = {w: math.log(N / (df + 1)) + 1 for w, df in doc_freqs.items()}
            
            self.tfidf_matrix = []
            for tf in doc_tfs:
                doc_vec = {}
                norm = 0
                for w, count in tf.items():
                    val = count * self.idf.get(w, 0)
                    doc_vec[w] = val
                    norm += val * val
                
                # Normalize vector
                norm = math.sqrt(norm)
                if norm > 0:
                    doc_vec = {w: val/norm for w, val in doc_vec.items()}
                self.tfidf_matrix.append(doc_vec)
                
            conn.close()
        except Exception as e:
            print(f"Error fetching from DB: {e}")
            self.videos_cache = []
            self.tfidf_matrix = []

    def get_candidate_videos(self):
        return self.videos_cache

    def get_video_index(self, video_id):
        for i, v in enumerate(self.videos_cache):
            if v['id'] == video_id:
                return i
        return -1

class RecommendationModel:
    def __init__(self):
        self.feature_gen = FeatureGenerator()
        
    def _cosine_sim(self, vec1, vec2):
        score = 0
        for w, val1 in vec1.items():
            if w in vec2:
                score += val1 * vec2[w]
        return score

    def rank_feed(self, user_history_video_ids, limit=10):
        self.feature_gen._refresh_cache()
        candidates = self.feature_gen.get_candidate_videos()
        if not candidates or not self.feature_gen.tfidf_matrix:
            return []

        watched_indices = []
        for vid in user_history_video_ids:
            idx = self.feature_gen.get_video_index(vid)
            if idx != -1:
                watched_indices.append(idx)

        if not watched_indices:
            return [{"video_id": c["id"], "score": 0.0} for c in candidates[:limit]]

        # Build user profile by averaging TF-IDF vectors
        user_profile = {}
        for idx in watched_indices:
            vec = self.feature_gen.tfidf_matrix[idx]
            for w, val in vec.items():
                user_profile[w] = user_profile.get(w, 0) + val
                
        # Normalize user profile
        norm = math.sqrt(sum(v*v for v in user_profile.values()))
        if norm > 0:
            user_profile = {w: v/norm for w, v in user_profile.items()}

        ranked_results = []
        for idx, candidate in enumerate(candidates):
            if idx in watched_indices:
                continue
            
            score = self._cosine_sim(user_profile, self.feature_gen.tfidf_matrix[idx])
            if score > 0:
                ranked_results.append({
                    "video_id": candidate["id"],
                    "score": round(score, 4)
                })

        ranked_results.sort(key=lambda x: x["score"], reverse=True)
        
        if len(ranked_results) < limit:
            existing_ids = {r["video_id"] for r in ranked_results}
            for c in candidates:
                if c["id"] not in existing_ids and self.feature_gen.get_video_index(c["id"]) not in watched_indices:
                    ranked_results.append({"video_id": c["id"], "score": 0.0})
                    if len(ranked_results) == limit:
                        break
                        
        return ranked_results[:limit]
