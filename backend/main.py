"""
FastAPI Backend для Yana.Diia.AI
Інтеграція з CodeMie SDK
"""
import os
import logging
from contextlib import asynccontextmanager
from dotenv import load_dotenv

# Load environment variables FIRST (before any other imports)
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import structlog

from config import settings
from utils.logger import setup_logger
from utils.error_handlers import (
    http_exception_handler,
    request_validation_error_handler,
    generic_exception_handler,
    CodeMieAPIError,
    codemie_api_error_handler,
    ValidationError,
    validation_error_handler,
)
from utils.http_client import HTTPClientManager

# Setup structured logging
logger = setup_logger(settings.log_level)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager for app startup/shutdown"""
    # Startup
    logger.info("Starting Yana.Diia Backend", port=settings.port)
    yield
    # Shutdown
    logger.info("Shutting down Yana.Diia Backend")
    # Cleanup HTTP client connections
    await HTTPClientManager.close()


# Create FastAPI app
app = FastAPI(
    title="Yana.Diia.AI Backend",
    description="AI Generator прототипів державних послуг",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register exception handlers
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, request_validation_error_handler)
app.add_exception_handler(CodeMieAPIError, codemie_api_error_handler)
app.add_exception_handler(ValidationError, validation_error_handler)
app.add_exception_handler(Exception, generic_exception_handler)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    from datetime import datetime
    return {
        "status": "ok",
        "service": "yana-diia-backend",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }


# Import routes
from routes import generate

app.include_router(generate.router, prefix="/api", tags=["generate"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=True,
        log_level=settings.log_level.lower()
    )
