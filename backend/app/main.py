from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from app.core.config import settings
from app.api.endpoints import router as api_router

app = FastAPI(
    title=settings.APP_NAME,
    description="IncidentPilot AI - Autonomous Cloud Incident Investigation & Human-Approved Remediation API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {
        "title": settings.APP_NAME,
        "status": "operational",
        "tagline": "From Alert to Resolution",
        "docs": "/docs",
        "health": "/api/health"
    }

# Mangum handler for AWS Lambda API Gateway integration
handler = Mangum(app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
