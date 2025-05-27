import os
from elasticsearch import Elasticsearch
from qdrant_client import QdrantClient
from qdrant_client.http import models
from twilio.rest import Client
import requests
import json
from config import *

class ServiceManager:
    def __init__(self):
        # Initialize Elasticsearch client
        self.es = Elasticsearch(
            ELASTICSEARCH_URL,
            api_key=ELASTICSEARCH_API_KEY,
            verify_certs=False  # Only for development
        )
        
        # Initialize Qdrant client
        self.qdrant = QdrantClient(
            url=QDRANT_URL,
            api_key=QDRANT_API_KEY
        )
        
        # Initialize Twilio client
        self.twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        
        # Initialize Ollama
        self.ollama_url = "http://localhost:11434"
        
    def test_elasticsearch_connection(self):
        try:
            health = self.es.cluster.health()
            print("Elasticsearch connection successful!")
            print(f"Cluster health: {health}")
            return True
        except Exception as e:
            print(f"Elasticsearch connection failed: {str(e)}")
            return False
            
    def test_qdrant_connection(self):
        try:
            collections = self.qdrant.get_collections()
            print("Qdrant connection successful!")
            print(f"Available collections: {collections}")
            return True
        except Exception as e:
            print(f"Qdrant connection failed: {str(e)}")
            return False
            
    def test_ollama_connection(self):
        try:
            response = requests.get(f"{self.ollama_url}/api/tags")
            if response.status_code == 200:
                print("Ollama connection successful!")
                print(f"Available models: {response.json()}")
                return True
            return False
        except Exception as e:
            print(f"Ollama connection failed: {str(e)}")
            return False

def main():
    manager = ServiceManager()
    
    # Test connections
    print("\nTesting service connections...")
    manager.test_elasticsearch_connection()
    manager.test_qdrant_connection()
    manager.test_ollama_connection()

if __name__ == "__main__":
    main() 