from typing import TypedDict, List, Dict, Any, Optional
from app.schemas.incident import (
    Incident, EvidenceItem, RootCauseAnalysis, Recommendation,
    InvestigationStep, SeverityEnum, RiskLevelEnum
)

class AgentGraphState(TypedDict):
    incident_id: str
    incident: Incident
    current_step: str
    steps_history: List[InvestigationStep]
    evidence_collected: List[EvidenceItem]
    root_cause_analysis: Optional[RootCauseAnalysis]
    recommendation: Optional[Recommendation]
    error: Optional[str]
    is_complete: bool
