import random
import math

class FeatureGenerator:
    def __init__(self, clickhouse_url="clickhouse://localhost"):
        self.clickhouse_url = clickhouse_url
        # In a real app, initialize clickhouse client here

    def get_user_features(self, user_id: int):
        """
        Query ClickHouse for the user's historical interaction events 
        (e.g., watch_time, likes, completion rates) and generate a user embedding vector.
        """
        # Mock ClickHouse query
        # query = f"SELECT event_type, value FROM analytics_events WHERE user_id={user_id} AND timestamp >= today() - 7"
        
        # Mocking a 64-dimensional user embedding vector generated from historical data
        return [random.uniform(-1, 1) for _ in range(64)]

    def get_candidate_videos(self):
        """
        Retrieve a pool of candidate videos. This could be from a fast recall layer (e.g., Faiss / Redis).
        """
        # Mock 100 candidate videos with random embeddings
        return [{"video_id": i, "embedding": [random.uniform(-1, 1) for _ in range(64)]} for i in range(1, 101)]

class RecommendationModel:
    def __init__(self):
        self.feature_gen = FeatureGenerator()

    def _dot_product(self, vec1, vec2):
        return sum(x * y for x, y in zip(vec1, vec2))

    def _cosine_similarity(self, vec1, vec2):
        dot = self._dot_product(vec1, vec2)
        norm1 = math.sqrt(sum(x*x for x in vec1))
        norm2 = math.sqrt(sum(x*x for x in vec2))
        if norm1 == 0 or norm2 == 0:
            return 0
        return dot / (norm1 * norm2)

    def rank_feed(self, user_id: int, limit: int = 10):
        """
        Two-Tower ranking model inference:
        1. Get user embedding
        2. Get candidate video embeddings
        3. Score candidates via dot product / cosine similarity
        4. Sort and return top K
        """
        user_vector = self.feature_gen.get_user_features(user_id)
        candidates = self.feature_gen.get_candidate_videos()

        ranked_results = []
        for candidate in candidates:
            # Score is cosine similarity between user preferences and video features
            score = self._cosine_similarity(user_vector, candidate["embedding"])
            ranked_results.append({
                "video_id": candidate["video_id"],
                "score": round(score, 4)
            })

        # Sort by score descending
        ranked_results.sort(key=lambda x: x["score"], reverse=True)
        return ranked_results[:limit]
