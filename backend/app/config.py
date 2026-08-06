import os

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./users.db")

# JWT Security Configuration
# In production, this should be loaded from environment variables
SECRET_KEY = os.getenv("SECRET_KEY", "b39afde50f1469e38e1b6d08064a7c85be8251e604fbd73f05bc93c042127db8")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
