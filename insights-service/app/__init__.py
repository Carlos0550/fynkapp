from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os
from .config import config_dict
db = SQLAlchemy()

def create_app():
    load_dotenv()
    env = os.getenv("FLASK_ENV", "development")
    app = Flask(__name__)
    app.config.from_object(config_dict[env])

    db.init_app(app)

    from .routes import bp
    app.register_blueprint(bp)

    return app

