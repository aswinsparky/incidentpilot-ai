from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import StreamingResponse
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone

from app.schemas.incident import (
    Incident, IncidentCreateRequest, IncidentReport, IncidentEvent,
    IncidentStatusEnum, SeverityEnum
)
from app.services.cloud_service import get_cloud_service, AbstractCloudService
from app.agents.supervisor import SupervisorOrchestrator

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "IncidentPilot AI Backend",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0"
    }

@router.get("/dashboard/stats")
def get_dashboard_stats(cloud_service: AbstractCloudService = Depends(get_cloud_service)):
    incidents = cloud_service.list_incidents()
    active_count = sum(1 for i in incidents if i.status != IncidentStatusEnum.RESOLVED)
    resolved_count = sum(1 for i in incidents if i.status == IncidentStatusEnum.RESOLVED)
    investigating_count = sum(1 for i in incidents if i.status == IncidentStatusEnum.INVESTIGATING)

    return {
        "active_incidents": active_count,
        "resolved_today": resolved_count,
        "mttr": "8m 21s",
        "ai_investigations_run": len(incidents),
        "system_status": "DEGRADED" if active_count > 0 else "HEALTHY",
        "services": [
            {
                "name": "production-api",
                "status": "DEGRADED" if active_count > 0 else "HEALTHY",
                "cpu_utilization": "78%",
                "memory_utilization": "94%" if active_count > 0 else "58%",
                "latency": "2,800ms" if active_count > 0 else "120ms",
                "error_rate": "18.5%" if active_count > 0 else "0.1%"
            },
            {
                "name": "user-db-cluster",
                "status": "HEALTHY",
                "cpu_utilization": "42%",
                "memory_utilization": "55%",
                "latency": "45ms",
                "error_rate": "0.0%"
            },
            {
                "name": "checkout-service",
                "status": "HEALTHY",
                "cpu_utilization": "38%",
                "memory_utilization": "52%",
                "latency": "95ms",
                "error_rate": "0.0%"
            }
        ]
    }

@router.get("/incidents", response_model=List[Incident])
def list_incidents(cloud_service: AbstractCloudService = Depends(get_cloud_service)):
    return cloud_service.list_incidents()

@router.post("/incidents", response_model=Incident)
def create_incident(
    req: IncidentCreateRequest,
    cloud_service: AbstractCloudService = Depends(get_cloud_service)
):
    return cloud_service.create_incident(
        title=req.title,
        service=req.service,
        severity=req.severity,
        description=req.description,
        scenario=req.scenario
    )

@router.get("/incidents/{incident_id}", response_model=Incident)
def get_incident(
    incident_id: str,
    cloud_service: AbstractCloudService = Depends(get_cloud_service)
):
    inc = cloud_service.get_incident(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return inc

@router.post("/incidents/{incident_id}/investigate")
def investigate_incident(
    incident_id: str,
    stream: bool = Query(False, description="Stream investigation steps using Server-Sent Events"),
    cloud_service: AbstractCloudService = Depends(get_cloud_service)
):
    inc = cloud_service.get_incident(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")

    orchestrator = SupervisorOrchestrator(inc)

    if stream:
        return StreamingResponse(
            orchestrator.stream_investigation_sse(),
            media_type="text/event-stream"
        )
    else:
        state = orchestrator.run_investigation_sync()
        cloud_service.update_incident(inc)
        return {
            "incident_id": inc.id,
            "status": inc.status,
            "evidence": state["evidence_collected"],
            "root_cause": state["root_cause_analysis"],
            "recommendation": state["recommendation"]
        }

@router.get("/incidents/{incident_id}/investigation")
def get_investigation_status(
    incident_id: str,
    cloud_service: AbstractCloudService = Depends(get_cloud_service)
):
    inc = cloud_service.get_incident(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    return {
        "incident_id": inc.id,
        "status": inc.status,
        "evidence_count": len(inc.evidence),
        "root_cause": inc.root_cause,
        "recommendation": inc.recommendation,
        "remediation_approved": inc.remediation_approved,
        "recovery_verified": inc.recovery_verified
    }

@router.post("/incidents/{incident_id}/approve", response_model=Incident)
@router.post("/incidents/{incident_id}/remediate", response_model=Incident)
def approve_and_remediate(
    incident_id: str,
    approved_by: str = Query("devops-lead@company.com"),
    cloud_service: AbstractCloudService = Depends(get_cloud_service)
):
    inc = cloud_service.get_incident(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")

    updated_inc = cloud_service.execute_remediation(incident_id, approved_by)
    # Also generate report automatically
    cloud_service.generate_report(incident_id)
    return updated_inc

@router.post("/incidents/{incident_id}/reject", response_model=Incident)
def reject_remediation(
    incident_id: str,
    cloud_service: AbstractCloudService = Depends(get_cloud_service)
):
    inc = cloud_service.get_incident(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")

    inc.remediation_rejected = True
    inc.status = IncidentStatusEnum.ACTIVE
    return cloud_service.update_incident(inc)

@router.get("/incidents/{incident_id}/timeline", response_model=List[IncidentEvent])
def get_incident_timeline(
    incident_id: str,
    cloud_service: AbstractCloudService = Depends(get_cloud_service)
):
    inc = cloud_service.get_incident(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    return inc.timeline

@router.post("/demo/simulate", response_model=Incident)
def simulate_demo_incident(
    scenario: str = Query("deployment_failure", description="Scenario: deployment_failure, db_degradation, or traffic_spike"),
    cloud_service: AbstractCloudService = Depends(get_cloud_service)
):
    scenarios_meta = {
        "deployment_failure": {
            "title": "Production API Memory Exhaustion & 5xx Surge",
            "service": "production-api",
            "severity": SeverityEnum.HIGH,
            "desc": "Simulated deployment release v42 memory leak anomaly."
        },
        "db_degradation": {
            "title": "Database Connection Pool Saturation",
            "service": "user-db-cluster",
            "severity": SeverityEnum.MEDIUM,
            "desc": "Simulated query latency surge causing pool starvation."
        },
        "traffic_spike": {
            "title": "Flash Sale Compute Capacity Stress",
            "service": "checkout-service",
            "severity": SeverityEnum.HIGH,
            "desc": "Simulated 300% request volume spike exceeding ASG limits."
        }
    }
    meta = scenarios_meta.get(scenario, scenarios_meta["deployment_failure"])
    return cloud_service.create_incident(
        title=meta["title"],
        service=meta["service"],
        severity=meta["severity"],
        description=meta["desc"],
        scenario=scenario
    )

@router.get("/reports", response_model=List[IncidentReport])
def list_reports(cloud_service: AbstractCloudService = Depends(get_cloud_service)):
    return cloud_service.list_reports()

@router.get("/reports/{report_id}", response_model=IncidentReport)
def get_report(
    report_id: str,
    cloud_service: AbstractCloudService = Depends(get_cloud_service)
):
    report = cloud_service.get_report(report_id)
    if not report:
        # Check if report_id is an incident_id
        try:
            report = cloud_service.generate_report(report_id)
        except Exception:
            raise HTTPException(status_code=404, detail="Report not found")
    return report
