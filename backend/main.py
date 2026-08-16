import os
import sys
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Ensure backend folder is in Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import engine, Base
import models
from routes import prediction, alerts, statistics

# Initialize Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Network Intrusion Detection & Threat Monitoring API",
    description="FastAPI Backend for NSL-KDD ML Classification & Isolation Forest Anomaly Detection",
    version="1.0.0"
)

# Enable CORS for React Vite Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(prediction.router)
app.include_router(alerts.router)
app.include_router(statistics.router)

@app.get("/")
def read_root():
    return {
        "message": "AI-Powered Network Intrusion Detection & Threat Monitoring API",
        "status": "Online",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "ml_model": "active",
        "anomaly_detector": "active"
    }

@app.exception_handler(Exception)
def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please check system logs."}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
