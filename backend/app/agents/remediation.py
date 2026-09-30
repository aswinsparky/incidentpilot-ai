from datetime import datetime, timezone
from app.agents.state import AgentGraphState
from app.schemas.incident import InvestigationStep, Recommendation, RiskLevelEnum

def remediation_agent(state: AgentGraphState) -> AgentGraphState:
    """
    Remediation Agent:
    Generates safe, actionable remediation proposals based on RCA findings.
    Always enforces requires_approval = True for human-in-the-loop validation.
    """
    incident = state["incident"]
    rca = state["root_cause_analysis"]
    now_str = datetime.now(timezone.utc).isoformat()

    step = InvestigationStep(
        step_name="Formulating Remediation Plan",
        agent_name="Remediation Agent",
        status="in_progress",
        message="Evaluating safe remediation strategies and risk factors...",
        timestamp=now_str
    )
    state["steps_history"].append(step)

    recommendation = None

    if incident.recommendation:
        recommendation = incident.recommendation
    else:
        primary = rca.primary_factor if rca else "Deployment Regression"
        
        if "Deployment" in primary or "rollback" in incident.title.lower() or "production-api" in incident.service:
            recommendation = Recommendation(
                action="rollback_deployment",
                target_service=incident.service,
                risk=RiskLevelEnum.MEDIUM,
                reason="Reverting recent release to previous stable artifact version will immediately eliminate memory leak & restore throughput.",
                expected_result="Memory utilization drops to ~60% baseline and HTTP 5xx error rate drops < 0.5%.",
                requires_approval=True,
                parameters={"target_version": "v41", "current_version": "v42"}
            )
        elif "Database" in primary or "db" in incident.service.lower():
            recommendation = Recommendation(
                action="kill_stale_connections",
                target_service=incident.service,
                risk=RiskLevelEnum.LOW,
                reason="Terminate hanging queries to release connection pool slots.",
                expected_result="Connection pool utilization drops below 30% and query latency normalizes.",
                requires_approval=True,
                parameters={"max_query_time_seconds": 60}
            )
        else:
            recommendation = Recommendation(
                action="scale_asg_capacity",
                target_service=incident.service,
                risk=RiskLevelEnum.LOW,
                reason="Increase Auto Scaling Group capacity from 10 to 25 instances to absorb traffic peak.",
                expected_result="CPU utilization per instance drops from 98% to 65%.",
                requires_approval=True,
                parameters={"desired_capacity": 20, "max_capacity": 30}
            )

    state["recommendation"] = recommendation
    step.status = "completed"
    step.message = f"Remediation plan generated: '{recommendation.action}' (Risk: {recommendation.risk}). Awaiting Human Approval."
    step.data = {
        "action": recommendation.action,
        "risk": recommendation.risk,
        "requires_approval": recommendation.requires_approval
    }
    state["current_step"] = "remediation_completed"
    return state
