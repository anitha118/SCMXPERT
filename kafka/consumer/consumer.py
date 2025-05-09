import os
import json  
from confluent_kafka import Consumer, KafkaError  
from pymongo import MongoClient 
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Kafka configuration from .env
consumer_config = {
    'bootstrap.servers': os.getenv('bootstrap_servers'), 
    'group.id': os.getenv('group_id', 'device_data_group'),
    'auto.offset.reset': os.getenv('offset_reset', 'earliest') 
}

topic = os.getenv('topic')

# MongoDB configuration
mongo_uri = os.getenv("MONGO_URI")             
mongo_db = os.getenv("MONGO_DB")                
mongo_collection = os.getenv("MONGO_COLLECTION")                

# Validate required env variables
if not consumer_config['bootstrap.servers'] or not topic or not mongo_uri or not mongo_db:  
    raise ValueError("Missing required environment variables.")

# Create Kafka consumer instance
consumer = Consumer(consumer_config)

# Connect to MongoDB
mongo_client = MongoClient(mongo_uri)
db = mongo_client[mongo_db] 
collection = db[mongo_collection] 


consumer.subscribe([topic]) 
print(f"Listening for device data on topic: {topic} ...")

try:
    while True:
        msg = consumer.poll(1.0)  
        if msg is None: 
            continue

        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                continue  
            else:
                print(f"Consumer error: {msg.error()}")
                continue

        try:
            data = json.loads(msg.value().decode('utf-8')) 
            print("Device Data Received:", data)

            # Insert into MongoDB
            collection.insert_one(data)
            print("Data inserted into MongoDB.")

        except json.JSONDecodeError as e:
            print("JSON decode error:", e)
        except Exception as e:
            print("Error processing or inserting message:", e)

except KeyboardInterrupt:
    print("\nConsumer stopped by user.")
finally:
    consumer.close()
    mongo_client.close()
    print("Kafka and MongoDB connections closed.")
