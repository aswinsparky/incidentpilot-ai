from datetime import datetime
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SeverityEnum(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class IncidentStatusEnum(str, Enum):
    ACTIVE = "ACTIVE"
    INVESTIGATING = "INVESTIGATING"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    REMEDIATING = "REMEDIATING"
    RESOLVED = "RESOLVED"

class RiskLevelEnum(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class EventCategoryEnum(str, Enum):
    ALERT = "alert"
    DEPLOYMENT = "deployment"
    TELEMETRY = "telemetry"
    AI_AGENT = "ai_agent"
    REMEDIATION = "remediation"
    VERIFICATION = "verification"

class MetricPoint(BaseModel):
    timestamp: str
    cpu_utilization: float
    memory_utilization: float
    latency_ms: float
    error_rate_pct: float

class LogEntry(BaseModel):
    timestamp: str
    level: str  # INFO, WARN, ERROR, CRITICAL
    message: str
    service: str

class IncidentEvent(BaseModel):
    id: str
    timestamp: str
    title: str
    description: str
    category: EventCategoryEnum
    details: Optional[Dict[str, Any]] = None

class EvidenceItem(BaseModel):
    type: str  # metric, log, deployment, alarm
    name: str
    observation: str
    timestamp: str
    severity: SeverityEnum = SeverityEnum.MEDIUM

class RootCauseAnalysis(BaseModel):
    description: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    primary_factor: str
    alternative_causes: List[str] = []
    reasoning_summary: str

class Recommendation(BaseModel):
    action: str  # e.g., rollback_deployment, scale_capacity, restart_service
    target_service: str
    risk: RiskLevelEnum
    reason: str
    expected_result: str
    requires_approval: bool = True
    parameters: Dict[str, Any] = {}

class RemediationResult(BaseModel):
    action: str
    status: str  # SUCCESS, FAILED
    executed_at: str
    executed_by: str
    output_message: str

class Incident(BaseModel):
    id: str
    title: str
    service: str
    severity: SeverityEnum
    status: IncidentStatusEnum
    created_at: str
    updated_at: str
    description: str
    
    # Telemetry data
    metrics: List[MetricPoint] = []
    logs: List[LogEntry] = []
    timeline: List[IncidentEvent] = []
    
    # AI Investigation details
    evidence: List[EvidenceItem] = []
    root_cause: Optional[RootCauseAnalysis] = None
    recommendation: Optional[Recommendation] = None
    
    # Execution & Recovery
    remediation_approved: bool = False
    remediation_rejected: bool = False
    remediation_result: Optional[RemediationResult] = None
    recovery_verified: bool = False

class IncidentCreateRequest(BaseModel):
    title: str
    service: str
    severity: SeverityEnum
    description: str
    scenario: Optional[str] = "deployment_failure"  # deployment_failure, db_degradation, traffic_spike

class InvestigationStep(BaseModel):
    step_name: str
    agent_name: str
    status: str  # in_progress, completed, failed
    message: str
    timestamp: str
    data: Optional[Dict[str, Any]] = None

class IncidentReport(BaseModel):
    id: str
    incident_id: str
    title: str
    created_at: str
    executive_summary: str
    timeline_summary: List[str]
    root_cause_analysis: RootCauseAnalysis
    evidence_collected: List[EvidenceItem]
    remediation_summary: str
    prevention_recommendations: List[str]
