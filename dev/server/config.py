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

    SQLALCHEMY_DATABASE_URI = "YOUR DATABASE URI HERE"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
