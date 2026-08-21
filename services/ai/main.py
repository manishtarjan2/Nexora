from flask import Flask, request, jsonify
import random
from recommendation import RecommendationModel

app = Flask(__name__)
recommender = RecommendationModel()

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "service": "Nexora AI"})

@app.route("/api/recommendations", methods=["POST"])
def get_recommendations():
    data = request.json or {}
    user_id = data.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
        
    limit = data.get("limit", 10)
    ranked_videos = recommender.rank_feed(user_id=user_id, limit=limit)
    return jsonify({"user_id": user_id, "recommendations": ranked_videos})

@app.route("/api/search", methods=["POST"])
def semantic_search():
    data = request.json or {}
    query = data.get("query", "")
    limit = data.get("limit", 10)
    
    # Mocking semantic search results
    search_results = [{"video_id": random.randint(1, 100), "relevance": round(random.uniform(0.5, 0.95), 2)} for _ in range(limit)]
    search_results.sort(key=lambda x: x["relevance"], reverse=True)
    return jsonify({"query": query, "results": search_results})

@app.route("/api/moderate", methods=["POST"])
def moderate_content():
    data = request.json or {}
    video_id = data.get("video_id")
    if not video_id:
        return jsonify({"error": "video_id is required"}), 400
        
    # Mocking a moderation pipeline result
    is_safe = random.choice([True, True, True, False]) # 75% chance of being safe
    return jsonify({
        "video_id": video_id,
        "is_safe": is_safe,
        "confidence_score": round(random.uniform(0.8, 0.99), 2),
        "flags": [] if is_safe else ["NSFW", "Violence"]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
