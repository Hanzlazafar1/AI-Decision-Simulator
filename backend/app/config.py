"""Application configuration loaded from environment variables."""

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings from environment."""

    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "groq")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    @property
    def active_api_key(self) -> str:
        if self.LLM_PROVIDER == "openai":
            return self.OPENAI_API_KEY
        return self.GROQ_API_KEY

    @property
    def active_model(self) -> str:
        if self.LLM_PROVIDER == "openai":
            return self.OPENAI_MODEL
        return self.GROQ_MODEL


settings = Settings()
