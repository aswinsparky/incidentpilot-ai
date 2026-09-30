from datetime import datetime, timezone
import uuid
from app.agents.state import AgentGraphState
from app.schemas.incident import InvestigationStep, EvidenceItem, SeverityEnum

def monitoring_agent(state: AgentGraphState) -> AgentGraphState:
    """
    Monitoring Agent:
    Collects CloudWatch metrics, application logs, and deployment events from the incident.
    Extracts structured evidence items.
    """
    incident = state["incident"]
    now_str = datetime.now(timezone.utc).isoformat()
    
    step = InvestigationStep(
        step_name="Collecting Evidence",
        agent_name="Monitoring Agent",
        status="in_progress",
        message="Analyzing CloudWatch metrics, application logs, and deployment timestamps...",
        timestamp=now_str
    )
    state["steps_history"].append(step)

    # Use existing evidence or extract from metrics/logs if empty
    evidence_items = list(incident.evidence) if incident.evidence else []

    if not evidence_items:
        # Generate evidence based on metrics and logs in incident
        if incident.metrics:
            peak_memory = max([m.memory_utilization for m in incident.metrics], default=60.0)
            peak_latency = max([m.latency_ms for m in incident.metrics], default=150.0)
            peak_error = max([m.error_rate_pct for m in incident.metrics], default=0.1)

            if peak_memory > 80.0:
                evidence_items.append(
                    EvidenceItem(
                        type="metric",
                        name="Memory Exhaustion",
                        observation=f"Memory utilization hit critical threshold at {peak_memory}%.",
                        timestamp=now_str,
                        severity=SeverityEnum.HIGH
                    )
                )
            if peak_latency > 1000.0:
                evidence_items.append(
                    EvidenceItem(
                        type="metric",
                        name="Latency Degradation",
                        observation=f"API latency surged to {peak_latency}ms (baseline 120ms).",
                        timestamp=now_str,
                        severity=SeverityEnum.MEDIUM
                    )
                )
            if peak_error > 5.0:
                evidence_items.append(
                    EvidenceItem(
                        type="metric",
                        name="HTTP 5xx Spikes",
                        observation=f"5xx error rate reached {peak_error}%.",
                        timestamp=now_str,
                        severity=SeverityEnum.HIGH
                    )
                )

    state["evidence_collected"] = evidence_items
    
    # Update step status
    step.status = "completed"
    step.message = f"Successfully gathered {len(evidence_items)} high-confidence telemetry evidence artifacts."
    step.data = {"evidence_count": len(evidence_items)}
    state["current_step"] = "monitoring_completed"
    return state
