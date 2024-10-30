# producer.py
from kafka import KafkaProducer
import json
import time
import random

producer = KafkaProducer(bootstrap_servers='localhost:9092', value_serializer=lambda v: json.dumps(v).encode('utf-8'))

def generate_price_data():
    while True:
        price_data = {
            "timestamp": time.time(),
            "price": random.uniform(50, 100)  # Simulate random price
        }
        producer.send('energy-pricing-topic', price_data)
        print(f"Sent: {price_data}")
        time.sleep(5)  # Send data every 5 seconds

if __name__ == "__main__":
    generate_price_data()
