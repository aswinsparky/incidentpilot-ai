import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "IncidentPilot AI"
    APP_ENV: str = "development"
    DEBUG: bool = True
    
    # Mode flags
    USE_MOCK_DATA: bool = True
    USE_AWS: bool = False
    
    # AWS Settings
    AWS_REGION: str = "us-east-1"
    DYNAMODB_INCIDENTS_TABLE: str = "IncidentPilot-Incidents"
    DYNAMODB_EVENTS_TABLE: str = "IncidentPilot-Events"
    DYNAMODB_INVESTIGATIONS_TABLE: str = "IncidentPilot-Investigations"
    DYNAMODB_REPORTS_TABLE: str = "IncidentPilot-Reports"
    
    BEDROCK_MODEL_ID: str = "anthropic.claude-3-haiku-20240307-v1:0"
    
    # Cognito Auth
    COGNITO_USER_POOL_ID: Optional[str] = None
    COGNITO_APP_CLIENT_ID: Optional[str] = None
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
