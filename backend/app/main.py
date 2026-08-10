from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS
from app.routes.health import router as health_router
from app.routes.analysis import router as analysis_router
from app.services.ml_service import get_ml_service

app = FastAPI(
    title="MachineSense Backend",
    description="Acoustic Signal Processing API for Heavy Machinery Predictive Maintenance",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    print("[FastAPI] Pre-loading & warming up Machine-Invariant ML Pipeline...")
    get_ml_service()

# Mount API routers under /api
app.include_router(health_router, prefix="/api", tags=["Health"])
app.include_router(analysis_router, prefix="/api", tags=["Analysis"])

@app.get("/")
def root():
    return {
        "message": "Welcome to MachineSense API",
        "health_check": "/api/health",
        "docs": "/docs"
    }
