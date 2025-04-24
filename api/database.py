from pymongo import MongoClient 
import os 
from dotenv import load_dotenv 

# Load .env from parent directory
env_path = os.path.join(os.path.dirname(__file__), '..', '.env') 
load_dotenv(dotenv_path=env_path) 


# Now connect
client = MongoClient(os.getenv("MONGO_URI")) 
db_name = os.getenv("MONGO_DB") 
db = client[db_name] 

# Access the required collections 
users_collection = db[os.getenv("users_collection")]
shipments_collection = db[os.getenv("shipments_collection")]
devices_collection = db[os.getenv("devices_collection")]
