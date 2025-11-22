"""
Input validation and sanitization utilities
"""
import re
from typing import Tuple


# Suspicious patterns that might indicate injection attempts
SUSPICIOUS_PATTERNS = [
    r"<script[^>]*>.*?</script>",  # XSS
    r"javascript:",  # XSS
    r"on\w+\s*=",  # Event handlers
    r"(union|select|insert|update|delete|drop|create|alter)\s+",  # SQL injection
    r"--",  # SQL comments
    r"/\*.*?\*/",  # SQL comments
    r"exec\s*\(",  # Code execution
    r"eval\s*\(",  # Code execution
]


def sanitize_input(text: str) -> str:
    """
    Sanitize user input by removing potentially dangerous content
    
    Args:
        text: Raw user input
        
    Returns:
        Sanitized text
    """
    # Remove null bytes
    text = text.replace('\x00', '')
    
    # Remove excessive whitespace
    text = ' '.join(text.split())
    
    # Remove HTML tags (basic)
    text = re.sub(r'<[^>]+>', '', text)
    
    return text.strip()


def validate_prompt(prompt: str, min_length: int = 10, max_length: int = 2000) -> Tuple[bool, str]:
    """
    Validate user prompt for security and format
    
    Args:
        prompt: User prompt to validate
        min_length: Minimum allowed length
        max_length: Maximum allowed length
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    # Check if empty
    if not prompt or not prompt.strip():
        return False, "Prompt cannot be empty"
    
    # Sanitize first
    sanitized = sanitize_input(prompt)
    
    # Check length
    if len(sanitized) < min_length:
        return False, f"Prompt too short (minimum {min_length} characters)"
    
    if len(sanitized) > max_length:
        return False, f"Prompt too long (maximum {max_length} characters)"
    
    # Check for suspicious patterns
    for pattern in SUSPICIOUS_PATTERNS:
        if re.search(pattern, sanitized, re.IGNORECASE):
            return False, "Prompt contains suspicious content"
    
    # Check if only whitespace after sanitization
    if not sanitized.strip():
        return False, "Prompt contains only whitespace or invalid characters"
    
    return True, ""


def validate_agent_id(agent_id: str) -> bool:
    """
    Validate agent ID format (UUID)
    
    Args:
        agent_id: Agent ID to validate
        
    Returns:
        True if valid UUID format
    """
    uuid_pattern = r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    return bool(re.match(uuid_pattern, agent_id, re.IGNORECASE))
