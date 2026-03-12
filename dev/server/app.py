import os
from flask import Flask
from flask_cors import CORS
from config import Config
from database.db import db
from models.user_model import User
from routes.auth_routes import auth_bp



app = Flask(__name__)

app.secret_key = os.urandom(24)
# app.config["SESSION_KEY"] = "eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6ImphbmUifQ.aZQCIw.iuLocljSzNr9SaNzpx6jqWREahY"

app.config.from_object(Config)

CORS(app, supports_credentials=True, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

db.init_app(app)
    
app.register_blueprint(auth_bp)

with app.app_context():
    db.create_all()







@app.route("/")
def home():
    return {"message": "Nurture Joy Backend Running Successfully"}

if __name__ == "__main__":
    app.run(debug=True)
