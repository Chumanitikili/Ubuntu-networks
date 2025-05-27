# Service Integration Project

This project integrates multiple services including Elasticsearch, Qdrant, Twilio, and Ollama.

## Prerequisites

- Python 3.8 or higher
- Ollama installed and running locally
- Qdrant running locally (or accessible via URL)

## Setup

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Make sure Ollama is running locally (default port: 11434)

3. Make sure Qdrant is running locally (default port: 6333)

## Configuration

The project uses the following services:

- Elasticsearch: Cloud-hosted instance
- Qdrant: Vector database
- Twilio: Messaging service (currently disabled)
- Ollama: Local LLM service

API keys and URLs are stored in `config.py`.

## Running the Project

To test all service connections:

```bash
python main.py
```

This will:
1. Test Elasticsearch connection
2. Test Qdrant connection
3. Test Ollama connection
4. Display available models and collections

## Notes

- The Twilio integration is currently disabled as requested
- Make sure Ollama is running locally before testing
- Elasticsearch connection uses SSL verification disabled for development
