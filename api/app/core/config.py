"""
Application configuration
"""
from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union
import json


class Settings(BaseSettings):
    """Application settings"""
    
    # Database
    DATABASE_URL: str
    ENABLE_TIMESCALE: bool = False
    
    # JWT
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    
    # AI Provider
    OPENAI_API_KEY: str = ""
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"
    DEEPSEEK_API_KEY: str = ""
    
    # DigitalOcean Spaces (optional)
    SPACES_ENDPOINT: str = ""
    SPACES_KEY: str = ""
    SPACES_SECRET: str = ""
    SPACES_BUCKET: str = ""
    
    # CORS - can be JSON string or comma-separated string
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Environment
    ENVIRONMENT: str = "development"
    
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        """Parse CORS_ORIGINS from JSON string or comma-separated string"""
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            # Try parsing as JSON first
            try:
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return parsed
            except json.JSONDecodeError:
                pass
            # Fall back to comma-separated
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v if isinstance(v, list) else ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

