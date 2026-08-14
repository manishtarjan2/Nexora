from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import random
from recommendation import RecommendationModel

app = FastAPI(title="Nexora AI", description="AI services for the Nexora platform")
recommender = RecommendationModel()

# Models
class RecommendationRequest(BaseModel):
    user_id: int
    limit: int = 10

class SearchRequest(BaseModel):
    query: str
    limit: int = 10

class ModerationRequest(BaseModel):
    video_id: int
    content: str # In reality, this would be a URL or object reference

# Roots
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Nexora AI"}

# Recommendation Engine Loop
@app.post("/api/recommendations")
def get_recommendations(req: RecommendationRequest):
    """
    Generate personalized video recommendations using the Two-Tower ML ranking model.
    """
    ranked_videos = recommender.rank_feed(user_id=req.user_id, limit=req.limit)
    return {"user_id": req.user_id, "recommendations": ranked_videos}

# Search Capability Stub
@app.post("/api/search")
def semantic_search(req: SearchRequest):
    """
    Perform semantic search over video metadata and transcripts.
    """
    # Mocking semantic search results
    search_results = [{"video_id": random.randint(1, 100), "relevance": round(random.uniform(0.5, 0.95), 2)} for _ in range(req.limit)]
    search_results.sort(key=lambda x: x["relevance"], reverse=True)
    return {"query": req.query, "results": search_results}

# Moderation Pipeline Stub
@app.post("/api/moderate")
def moderate_content(req: ModerationRequest):
    """
    Automatically scan uploaded content for safety and guidelines violations.
    """
    # Mocking a moderation pipeline result
    is_safe = random.choice([True, True, True, False]) # 75% chance of being safe
    return {
        "video_id": req.video_id,
        "is_safe": is_safe,
        "confidence_score": round(random.uniform(0.8, 0.99), 2),
        "flags": [] if is_safe else ["NSFW", "Violence"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
