from fastapi import APIRouter, HTTPException, status
from app.models.schemas import AIBugAnalysisRequest, AIBugAnalysisResponse
from app.ai.bug_analyzer import bug_analyzer

router = APIRouter(prefix="/bugs", tags=["bug-analysis"])


@router.post("/analyze", response_model=AIBugAnalysisResponse)
async def analyze_failure(request: AIBugAnalysisRequest):
    """
    AI-driven root cause failure diagnosis and Jira ticket generation.
    """
    try:
        return await bug_analyzer.analyze_failure(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Bug diagnosis error: {str(e)}"
        )
