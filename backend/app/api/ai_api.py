from fastapi import APIRouter, HTTPException, status
from app.models.schemas import AITestGenerationRequest, AITestGenerationResponse
from app.ai.test_generator import test_generator
from app.services.report_service import report_service

router = APIRouter(prefix="/ai", tags=["ai-testing"])


@router.post("/generate", response_model=AITestGenerationResponse)
async def generate_test_cases(request: AITestGenerationRequest):
    """
    Generate automated API test cases from user story or endpoint specs.
    """
    try:
        response = await test_generator.generate_test_cases(request)
        # Auto-save generated cases
        if response.generated_test_cases:
            report_service.save_test_cases(response.generated_test_cases)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Test case generation error: {str(e)}"
        )
