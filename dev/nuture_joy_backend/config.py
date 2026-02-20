import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # SQLALCHEMY_DATABASE_URI = (
    #     f"postgresql://{os.getenv('DB_USERNAME')}:"
    #     f"{os.getenv('DB_PASSWORD')}@"
    #     f"{os.getenv('DB_HOST')}:"
    #     f"{os.getenv('DB_PORT')}/"
    #     f"{os.getenv('DB_NAME')}"
    # )

    # SQLALCHEMY_DATABASE_URI = "postgresql://postgres:admin123@localhost:5433/nuturejoy"
    SQLALCHEMY_DATABASE_URI = "postgresql://neondb_owner:npg_mTgL3UexS5aM@ep-young-pine-ai18kf66-pooler.c-4.us-east-1.aws.neon.tech/nuturejoy?sslmode=require&channel_binding=require"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
