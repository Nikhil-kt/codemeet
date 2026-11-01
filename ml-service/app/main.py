"""
ImpactLink AI / ML Microservice (FastAPI)
Provides hybrid volunteer matching, duplicate submission detection,
OCR document verification, and campaign intelligence analytics.
"""

from fastapi import FastAPI, HTTPException, Security, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security.api_key import APIKeyHeader
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import os

try:
    from dotenv import load_dotenv
    for p in [
        os.path.join(os.path.dirname(__file__), "../../.env"),
        os.path.join(os.getcwd(), ".env"),
        os.path.join(os.getcwd(), "../.env"),
    ]:
        if os.path.exists(p):
            load_dotenv(dotenv_path=p)
            break
except ImportError:
    pass

from app.matching import VolunteerMatcher
from app.similarity import ReportDeduplicator
from app.document_analysis import DocumentAnalyzer
from app.campaign_metrics import CampaignAnalyzer

app = FastAPI(
    title="ImpactLink ML Service",
    version="1.0.0",
    description="Intelligent Volunteer Matching, Report Deduplication, OCR and Campaign Analytics Engine"
)

# CORS Configuration
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if "*" not in origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engines
matcher = VolunteerMatcher()
deduplicator = ReportDeduplicator()
doc_analyzer = DocumentAnalyzer()
campaign_analyzer = CampaignAnalyzer()

# Inter-service Authentication
SERVICE_KEY_HEADER = APIKeyHeader(name="X-Service-Key", auto_error=False)


def verify_service_auth(api_key: Optional[str] = Security(SERVICE_KEY_HEADER)):
    expected = os.getenv("ML_SERVICE_SECRET")
    if expected:
        if not api_key or api_key != expected:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized: Invalid or missing X-Service-Key header"
            )
    return True


# Pydantic Request Models
class MatchEventRequest(BaseModel):
    event: Dict[str, Any]
    volunteers: List[Dict[str, Any]]
    config: Optional[Dict[str, Any]] = None


class SimilarityRequest(BaseModel):
    new_report: Dict[str, Any]
    existing_reports: List[Dict[str, Any]]
    threshold: Optional[float] = None


class DocumentAnalysisRequest(BaseModel):
    document_text: str
    document_type: str
    organization_profile: Dict[str, Any]


class CampaignPredictRequest(BaseModel):
    event_data: Dict[str, Any]
    registrations: List[Dict[str, Any]] = []
    tasks: List[Dict[str, Any]] = []
    attendance: List[Dict[str, Any]] = []


@app.get("/")
def root():
    return {
        "name": "ImpactLink ML Service",
        "status": "operational",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "ImpactLink ML Service",
        "version": "1.0.0",
        "engines": ["VolunteerMatcher", "ReportDeduplicator", "DocumentAnalyzer", "CampaignAnalyzer"]
    }


@app.get("/ready")
def ready_check():
    return {
        "status": "ready",
        "models_loaded": True
    }


@app.post("/ml/v1/match/event", dependencies=[Depends(verify_service_auth)])
def match_event_volunteers(payload: MatchEventRequest):
    try:
        results = matcher.rank_volunteers(payload.event, payload.volunteers, payload.config)
        return {
            "success": True,
            "event_id": payload.event.get("id"),
            "total_candidates_evaluated": len(payload.volunteers),
            "matched_volunteers_count": len(results),
            "recommendations": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matching failure: {str(e)}")


@app.post("/ml/v1/reports/similarity", dependencies=[Depends(verify_service_auth)])
def check_report_similarity(payload: SimilarityRequest):
    try:
        analysis = deduplicator.analyze_submission(
            payload.new_report,
            payload.existing_reports,
            payload.threshold
        )
        return {
            "success": True,
            "report_id": payload.new_report.get("id"),
            "analysis": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Similarity failure: {str(e)}")


@app.post("/ml/v1/documents/analyze", dependencies=[Depends(verify_service_auth)])
def analyze_organization_document(payload: DocumentAnalysisRequest):
    try:
        result = doc_analyzer.analyze_document(
            payload.document_text,
            payload.document_type,
            payload.organization_profile
        )
        return {
            "success": True,
            "analysis": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document analysis failure: {str(e)}")


@app.post("/ml/v1/campaign/predict", dependencies=[Depends(verify_service_auth)])
def predict_campaign_performance(payload: CampaignPredictRequest):
    try:
        metrics = campaign_analyzer.analyze_campaign(
            payload.event_data,
            payload.registrations,
            payload.tasks,
            payload.attendance
        )
        return {
            "success": True,
            "metrics": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Campaign prediction failure: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
