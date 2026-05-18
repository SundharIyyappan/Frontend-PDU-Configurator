# Hyper PDU Configurator - Backend

## Setup
1. Create virtual environment: `python -m venv venv`
2. Activate it:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Setup postgres DB and run Flyway migrations (outside this setup).

## Run
You can run the server in two ways:

1. Using `run.py` (preferred):
   ```bash
   python run.py
   ```

2. Using uvicorn directly:
   ```bash
   uvicorn app.main:app --reload
   ```
