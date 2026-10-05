import os
from pathlib import Path
from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
ROOT_DIR = BACKEND_DIR.parent


class Settings(BaseSettings):
    PROJECT_NAME: str = "TestForge - AI Software Testing & QA Automation Platform"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Google Gemini API
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"

    # Testing Defaults
    DEFAULT_TIMEOUT_SECONDS: int = 15
    MAX_CONCURRENT_TESTS: int = 10
    DEFAULT_BASE_URL: str = "https://jsonplaceholder.typicode.com"

    # Paths
    REPORTS_DIR: str = str(ROOT_DIR / "reports")
    TEST_DATA_DIR: str = str(ROOT_DIR / "test_data")

    # Server & CORS
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ALLOWED_ORIGINS: Union[str, List[str]] = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"

    @property
    def cors_origins(self) -> List[str]:
        if isinstance(self.ALLOWED_ORIGINS, list):
            return self.ALLOWED_ORIGINS
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(
        env_file=str(BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()

os.makedirs(settings.REPORTS_DIR, exist_ok=True)
os.makedirs(settings.TEST_DATA_DIR, exist_ok=True)
os.makedirs(Path(settings.TEST_DATA_DIR) / "sample_requests", exist_ok=True)
os.makedirs(Path(settings.TEST_DATA_DIR) / "test_cases", exist_ok=True)
