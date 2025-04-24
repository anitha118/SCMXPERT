import socket 
import os
import json 
from confluent_kafka import Producer 
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Kafka configuration
producer_config = {
    'bootstrap.servers': os.getenv('bootstrap_servers') 
}
topic = os.getenv("topic")
host = os.getenv("host")
port = int(os.getenv("port"))

# Create a Kafka Producer instance
producer = Producer(producer_config)

# Delivery report callback
def delivery_report(err, msg):
    if err is not None:
        print(f"Delivery failed: {err}")
    else:
        print(f"Message delivered to {msg.topic()} [{msg.partition()}] @ offset {msg.offset()}")

# Connect to the TCP server
try:
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
    server.connect((host, port))
    print(f"Connected to TCP server at {host}:{port}")
except Exception as e:
    print(f"Failed to connect to TCP server: {e}")
    exit(1)

# Continuously read from TCP socket and send to Kafka
try:
    while True:
        message = server.recv(4096).decode('utf-8').strip() 


        if not message:
            continue

        try:
            json_data = json.loads(message)

            if isinstance(json_data, list): #Each record in the list is sent individually to Kafka.
                for record in json_data:
                    producer.produce(
                        topic,
                        value=json.dumps(record),
                        callback=delivery_report
                    )
            elif isinstance(json_data, dict): #Sends one message to Kafka.
                producer.produce(
                    topic,
                    value=json.dumps(json_data),
                    callback=delivery_report
                )
            else:
                print("Unsupported data format received.")

            producer.flush() #Ensures all messages are actually sent to Kafka not just sitting in memory.
            
        except json.JSONDecodeError as e: assert
            print(f"JSON decode error: {e}")
        except Exception as e: #Kafka send failures
            print(f"Error sending data to Kafka: {e}")

except KeyboardInterrupt:
    print("Producer stopped by user.")
finally:
    producer.flush()
    producer.close()
    server.close()
    