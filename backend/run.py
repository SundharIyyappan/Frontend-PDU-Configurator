import os
import uvicorn

if __name__ == "__main__":
    # Get port from environment variables, default to 8000
    port = int(os.environ.get("PORT", 8000))
    
    # Run uvicorn programmatically
    # uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )
