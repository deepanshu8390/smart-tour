from pymongo import MongoClient

from app.core.config import settings


mongo_client = MongoClient(settings.mongo_uri, serverSelectionTimeoutMS=3000)
mongo_database = mongo_client[settings.mongo_database]


def close_mongo() -> None:
    mongo_client.close()
