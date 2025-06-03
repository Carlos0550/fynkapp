import os

class BaseConfig:
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:35218889@localhost/fynkapp_database"
    DEBUG = True

class ProductionConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
    DEBUG = False

config_dict = {
    "development": DevelopmentConfig,
    "production": ProductionConfig
}
