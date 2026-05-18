#  for FastAPI projects we use pydantic-settings because it gives you type safety on top of env loading.
# So the import is:

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    DATABASE_URL : str
    SECRET_KEY : str
    GROQ_API_KEY : str
    TTS_API_KEY : str
    ALGORITHM : str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES : int = 30

settings = Settings()

