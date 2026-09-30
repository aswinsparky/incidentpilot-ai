import json
import asyncio
from datetime import datetime, timezone
from typing import AsyncGenerator, Dict, Any, List

from app.schemas.incident import Incident, InvestigationStep, IncidentStatusEnum
from app.agents.state import AgentGraphState
from app.agents.monitoring import monitoring_agent
from app.agents.rca import rca_agent
from app.agents.remediation import remediation_agent
from app.agents.report import report_agent

class SupervisorOrchestrator:
    def __init__(self, incident: Incident):
        self.state: AgentGraphState = {
            "incident_id": incident.id,
            "incident": incident,
            "current_step": "init",
            "steps_history": [],
            "evidence_collected": [],
            "root_cause_analysis": None,
            "recommendation": None,
            "error": None,
            "is_complete": False
        }

    def run_investigation_sync(self) -> AgentGraphState:
        """Run all agent stages synchronously."""
        # 1. Monitoring Agent
        self.state = monitoring_agent(self.state)
        # 2. RCA Agent
        self.state = rca_agent(self.state)
        # 3. Remediation Agent
        self.state = remediation_agent(self.state)
        # 4. Report Agent
        self.state = report_agent(self.state)
        
        # Update incident object
        inc = self.state["incident"]
        inc.evidence = self.state["evidence_collected"]
        inc.root_cause = self.state["root_cause_analysis"]
        inc.recommendation = self.state["recommendation"]
        inc.status = IncidentStatusEnum.PENDING_APPROVAL
        
        return self.state

    async def stream_investigation_sse(self) -> AsyncGenerator[str, None]:
        """Stream live step-by-step investigation events for SSE frontend update."""
        stages = [
            ("monitoring", monitoring_agent, "Collecting CloudWatch metrics & log artifacts..."),
            ("rca", rca_agent, "Analyzing temporal correlations & root cause probability..."),
            ("remediation", remediation_agent, "Generating safe, human-approvable remediation plan..."),
            ("report", report_agent, "Synthesizing post-mortem summary & executive evidence..."),
        ]

        for stage_name, agent_func, desc in stages:
            await asyncio.sleep(0.6) # Short delay for visible step streaming
            self.state = agent_func(self.state)
            latest_step = self.state["steps_history"][-1]
            
            event_payload = {
                "incident_id": self.state["incident_id"],
                "step_name": latest_step.step_name,
                "agent_name": latest_step.agent_name,
                "status": latest_step.status,
                "message": latest_step.message,
                "timestamp": latest_step.timestamp,
                "evidence_count": len(self.state["evidence_collected"]),
                "root_cause": self.state["root_cause_analysis"].model_dump() if self.state["root_cause_analysis"] else None,
                "recommendation": self.state["recommendation"].model_dump() if self.state["recommendation"] else None,
                "is_complete": self.state["is_complete"]
            }
            yield f"data: {json.dumps(event_payload)}\n\n"

        # Update incident object final state
        inc = self.state["incident"]
        inc.evidence = self.state["evidence_collected"]
        inc.root_cause = self.state["root_cause_analysis"]
        inc.recommendation = self.state["recommendation"]
        inc.status = IncidentStatusEnum.PENDING_APPROVAL
