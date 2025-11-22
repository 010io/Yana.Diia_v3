"""
HTTP Client utilities with connection pooling
"""
import httpx
from typing import Optional


class HTTPClientManager:
    """Singleton HTTP client manager with connection pooling"""
    
    _instance: Optional[httpx.AsyncClient] = None
    
    @classmethod
    def get_client(cls) -> httpx.AsyncClient:
        """
        Get or create HTTP client with connection pooling
        
        Returns:
            Configured AsyncClient instance
        """
        if cls._instance is None:
            cls._instance = httpx.AsyncClient(
                timeout=httpx.Timeout(30.0),
                limits=httpx.Limits(
                    max_keepalive_connections=10,
                    max_connections=20,
                    keepalive_expiry=30.0
                ),
                follow_redirects=True,
            )
        return cls._instance
    
    @classmethod
    async def close(cls):
        """Close HTTP client and cleanup connections"""
        if cls._instance is not None:
            await cls._instance.aclose()
            cls._instance = None


# Global client instance getter
def get_http_client() -> httpx.AsyncClient:
    """Get HTTP client for dependency injection"""
    return HTTPClientManager.get_client()
