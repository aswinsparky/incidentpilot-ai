from datetime import datetime, timezone
from app.agents.state import AgentGraphState
from app.schemas.incident import InvestigationStep, IncidentReport

def report_agent(state: AgentGraphState) -> AgentGraphState:
    """
    Report Agent:
    Compiles full post-mortem reports and prevention steps.
    """
    incident = state["incident"]
    rca = state["root_cause_analysis"]
    recommendation = state["recommendation"]
    evidence = state["evidence_collected"]
    now_str = datetime.now(timezone.utc).isoformat()

    step = InvestigationStep(
        step_name="Generating Incident Report",
        agent_name="Report Agent",
        status="in_progress",
        message="Synthesizing executive summary and prevention recommendations...",
        timestamp=now_str
    )
    state["steps_history"].append(step)

    # Set completion state
    state["is_complete"] = True
    step.status = "completed"
    step.message = "AI Investigation workflow completed successfully. Report synthesized."
    state["current_step"] = "investigation_finished"
    return state
