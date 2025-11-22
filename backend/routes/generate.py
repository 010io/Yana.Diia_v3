"""
API Routes для генерації flows та UI
"""
from fastapi import APIRouter, HTTPException, status, Depends
import structlog
from services.codemie_service import CodeMieService
from models import GenerateRequest, GenerateResponse, StatusResponse

logger = structlog.get_logger()
router = APIRouter()


def get_codemie_service() -> CodeMieService:
    """
    Dependency injection for CodeMie service
    Lazy initialization - creates service on first request
    """
    try:
        return CodeMieService()
    except Exception as e:
        logger.error("Failed to initialize CodeMie service", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="CodeMie service not available. Check credentials in .env"
        )


@router.post("/generate", response_model=GenerateResponse, status_code=status.HTTP_200_OK)
async def generate(
    request: GenerateRequest,
    service: CodeMieService = Depends(get_codemie_service)
):
    """
    Generate flow and UI prototype from prompt
    
    Uses CodeMie SDK to:
    1. Generate flow structure (Agent 1)
    2. Generate UI prototype (Agent 2)
    
    Returns complete flow + UI or error
    """
    logger.info("Received generate request", prompt_length=len(request.prompt))
    
    try:
        # Call CodeMie service
        result = await service.generate_complete(request.prompt)
        
        # Return response
        return GenerateResponse(**result)
        
    except ValueError as e:
        logger.error("Validation error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid input: {str(e)}"
        )
    except TimeoutError as e:
        logger.error("Timeout error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="CodeMie API timeout (>30s). Try again."
        )
    except Exception as e:
        logger.error("Unexpected error", error=str(e), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal error: {str(e)}"
        )


@router.get("/status", response_model=StatusResponse)
async def status_check(service: CodeMieService = Depends(get_codemie_service)):
    """Check if CodeMie service is available"""
    return StatusResponse(
        codemie_available=True,
        agent_flow_id=service.agent_flow_id,
        agent_ui_id=service.agent_ui_id,
        api_url=service.api_url
    )
