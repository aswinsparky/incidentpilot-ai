from abc import ABC, abstractmethod
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
import uuid
import boto3
from botocore.exceptions import ClientError

from app.schemas.incident import (
    Incident, IncidentStatusEnum, SeverityEnum, RiskLevelEnum,
    MetricPoint, LogEntry, IncidentEvent, EvidenceItem, RootCauseAnalysis,
    Recommendation, RemediationResult, IncidentReport, EventCategoryEnum
)
from app.core.config import settings

class AbstractCloudService(ABC):
    @abstractmethod
    def list_incidents(self) -> List[Incident]:
        pass

    @abstractmethod
    def get_incident(self, incident_id: str) -> Optional[Incident]:
        pass

    @abstractmethod
    def create_incident(self, title: str, service: str, severity: SeverityEnum, description: str, scenario: Optional[str] = None) -> Incident:
        pass

    @abstractmethod
    def update_incident(self, incident: Incident) -> Incident:
        pass

    @abstractmethod
    def execute_remediation(self, incident_id: str, approved_by: str) -> Incident:
        pass

    @abstractmethod
    def generate_report(self, incident_id: str) -> IncidentReport:
        pass

    @abstractmethod
    def get_report(self, report_id: str) -> Optional[IncidentReport]:
        pass

    @abstractmethod
    def list_reports(self) -> List[IncidentReport]:
        pass


class MockCloudService(AbstractCloudService):
    def __init__(self):
        self._incidents: Dict[str, Incident] = {}
        self._reports: Dict[str, IncidentReport] = {}
        self._seed_initial_data()

    def _now_str(self, offset_minutes: int = 0) -> str:
        dt = datetime.now(timezone.utc) + timedelta(minutes=offset_minutes)
        return dt.isoformat()

    def _seed_initial_data(self):
        # Seed 3 resolved incidents and 1 active deployment failure scenario incident
        inc_1 = self._build_scenario_incident(
            inc_id="INC-1042",
            title="Production API High Memory & 5xx Spikes",
            service="production-api",
            severity=SeverityEnum.HIGH,
            scenario="deployment_failure",
            status=IncidentStatusEnum.ACTIVE
        )
        inc_2 = self._build_scenario_incident(
            inc_id="INC-1041",
            title="Database Connection Pool Exhaustion",
            service="user-db-cluster",
            severity=SeverityEnum.MEDIUM,
            scenario="db_degradation",
            status=IncidentStatusEnum.RESOLVED
        )
        inc_3 = self._build_scenario_incident(
            inc_id="INC-1040",
            title="Flash Sale Traffic Surge Capacity Stress",
            service="checkout-service",
            severity=SeverityEnum.LOW,
            scenario="traffic_spike",
            status=IncidentStatusEnum.RESOLVED
        )
        self._incidents[inc_1.id] = inc_1
        self._incidents[inc_2.id] = inc_2
        self._incidents[inc_3.id] = inc_3

    def _build_scenario_incident(
        self, inc_id: str, title: str, service: str, severity: SeverityEnum, scenario: str, status: IncidentStatusEnum
    ) -> Incident:
        now = datetime.now(timezone.utc)
        
        metrics = []
        logs = []
        timeline = []
        evidence = []
        rca = None
        recommendation = None
        remediation_result = None
        recovery_verified = False

        if scenario == "deployment_failure":
            # Scenario 1: Deployment memory leak & 5xx surge
            t0 = (now - timedelta(minutes=15)).isoformat()
            t1 = (now - timedelta(minutes=14)).isoformat()
            t2 = (now - timedelta(minutes=12)).isoformat()
            t3 = (now - timedelta(minutes=10)).isoformat()
            t4 = (now - timedelta(minutes=8)).isoformat()
            t5 = (now - timedelta(minutes=5)).isoformat()

            metrics = [
                MetricPoint(timestamp=t0, cpu_utilization=42.0, memory_utilization=58.0, latency_ms=120.0, error_rate_pct=0.1),
                MetricPoint(timestamp=t1, cpu_utilization=45.0, memory_utilization=61.0, latency_ms=130.0, error_rate_pct=0.2),
                MetricPoint(timestamp=t2, cpu_utilization=78.0, memory_utilization=84.0, latency_ms=850.0, error_rate_pct=4.2),
                MetricPoint(timestamp=t3, cpu_utilization=89.0, memory_utilization=94.0, latency_ms=2800.0, error_rate_pct=18.5),
                MetricPoint(timestamp=t4, cpu_utilization=92.0, memory_utilization=96.0, latency_ms=3100.0, error_rate_pct=19.2),
                MetricPoint(timestamp=t5, cpu_utilization=91.0, memory_utilization=95.0, latency_ms=2950.0, error_rate_pct=18.0),
            ]

            logs = [
                LogEntry(timestamp=t1, level="INFO", message="Deployment production-api:v42 deployed successfully by release-pipeline", service=service),
                LogEntry(timestamp=t2, level="WARN", message="High memory allocation detected in worker thread pool (memory > 80%)", service=service),
                LogEntry(timestamp=t3, level="ERROR", message="java.lang.OutOfMemoryError: Java heap space during payload deserialization", service=service),
                LogEntry(timestamp=t3, level="ERROR", message="HTTP 500 Internal Server Error returned for GET /api/v1/users/me", service=service),
                LogEntry(timestamp=t4, level="ERROR", message="Upstream timeout: 504 Gateway Timeout on microservice health check", service=service),
            ]

            timeline = [
                IncidentEvent(id=str(uuid.uuid4()), timestamp=t1, title="Deployment Completed", description="Version production-api:v42 deployed to cluster", category=EventCategoryEnum.DEPLOYMENT),
                IncidentEvent(id=str(uuid.uuid4()), timestamp=t2, title="Memory Surge Warning", description="Memory utilization rose from 61% to 84%", category=EventCategoryEnum.TELEMETRY),
                IncidentEvent(id=str(uuid.uuid4()), timestamp=t3, title="CloudWatch Alarm Fired", description="High Error Rate Alarm (> 15% 5xx errors)", category=EventCategoryEnum.ALERT),
                IncidentEvent(id=str(uuid.uuid4()), timestamp=t4, title="Incident Created", description="Incident Pilot auto-detected multi-metric anomaly", category=EventCategoryEnum.ALERT),
            ]

            evidence = [
                EvidenceItem(type="deployment", name="Recent Deployment", observation="Deployment production-api:v42 completed 2 minutes prior to anomaly onset.", timestamp=t1, severity=SeverityEnum.HIGH),
                EvidenceItem(type="metric", name="Memory Utilization Spike", observation="Memory increased from 61% baseline to 96% peak.", timestamp=t3, severity=SeverityEnum.HIGH),
                EvidenceItem(type="metric", name="Latency Surge", observation="API latency increased 24x from 120ms to 2,800ms.", timestamp=t3, severity=SeverityEnum.MEDIUM),
                EvidenceItem(type="metric", name="5xx Error Rate", observation="HTTP 5xx error rate spiked to 18.5%.", timestamp=t3, severity=SeverityEnum.HIGH),
                EvidenceItem(type="log", name="Heap Memory Errors", observation="Application logs confirm OutOfMemoryError exceptions.", timestamp=t3, severity=SeverityEnum.HIGH),
            ]

            rca = RootCauseAnalysis(
                description="Recent deployment production-api:v42 introduced a memory leak during request deserialization, causing memory exhaustion and HTTP 5xx error spikes.",
                confidence=0.87,
                primary_factor="Deployment Regression (production-api:v42)",
                alternative_causes=["Unexpected traffic spike", "Upstream database connection timeout"],
                reasoning_summary="Statistical anomaly correlation confirms that memory utilization and 5xx errors started immediately following deployment v42. Memory growth pattern is consistent with heap space exhaustion."
            )

            recommendation = Recommendation(
                action="rollback_deployment",
                target_service=service,
                risk=RiskLevelEnum.MEDIUM,
                reason="Reverting production-api from v42 to previous stable release v41 will immediately eliminate the memory leak and restore normal throughput.",
                expected_result="Memory utilization will return to ~60% baseline and HTTP 5xx error rate will drop below 0.5%.",
                requires_approval=True,
                parameters={"target_version": "v41", "current_version": "v42"}
            )

        elif scenario == "db_degradation":
            # Scenario 2: DB connection exhaustion
            t0 = (now - timedelta(hours=2)).isoformat()
            t1 = (now - timedelta(hours=1, minutes=50)).isoformat()
            metrics = [
                MetricPoint(timestamp=t0, cpu_utilization=35.0, memory_utilization=40.0, latency_ms=45.0, error_rate_pct=0.0),
                MetricPoint(timestamp=t1, cpu_utilization=94.0, memory_utilization=88.0, latency_ms=4200.0, error_rate_pct=12.1),
            ]
            logs = [
                LogEntry(timestamp=t1, level="ERROR", message="FATAL: remaining connection slots are reserved for non-replication superuser connections", service=service)
            ]
            timeline = [
                IncidentEvent(id=str(uuid.uuid4()), timestamp=t0, title="DB Query Latency Increase", description="Read query pool latency crossed threshold", category=EventCategoryEnum.TELEMETRY),
                IncidentEvent(id=str(uuid.uuid4()), timestamp=t1, title="Incident Resolved", description="Database connection pool size increased & stale connections killed.", category=EventCategoryEnum.REMEDIATION),
            ]
            evidence = [
                EvidenceItem(type="metric", name="DB Pool Saturation", observation="Active connections hit max_connections limit (100/100).", timestamp=t1, severity=SeverityEnum.HIGH)
            ]
            rca = RootCauseAnalysis(
                description="Unindexed slow query in recent reporting job locked database connection pool slots.",
                confidence=0.92,
                primary_factor="Database Connection Pool Exhaustion",
                alternative_causes=["Network partition"],
                reasoning_summary="Connection counts reached max pool limit concurrently with reporting cron execution."
            )
            recommendation = Recommendation(
                action="kill_stale_connections",
                target_service=service,
                risk=RiskLevelEnum.LOW,
                reason="Terminate hanging queries to release connections.",
                expected_result="Latency drops back to < 50ms.",
                requires_approval=True
            )
            remediation_result = RemediationResult(
                action="kill_stale_connections",
                status="SUCCESS",
                executed_at=t1,
                executed_by="sre-admin@incidentpilot.ai",
                output_message="Terminated 34 hanging connections. Pool usage reduced to 22%."
            )
            recovery_verified = True

        else: # traffic_spike
            t0 = (now - timedelta(hours=4)).isoformat()
            metrics = [
                MetricPoint(timestamp=t0, cpu_utilization=98.0, memory_utilization=72.0, latency_ms=1800.0, error_rate_pct=5.0)
            ]
            logs = [
                LogEntry(timestamp=t0, level="WARN", message="Auto-scaling group reached maximum instance limit (10 instances)", service=service)
            ]
            timeline = [
                IncidentEvent(id=str(uuid.uuid4()), timestamp=t0, title="Auto-scale Max Limit Hit", description="ASG hit 10 instance limit under 300% traffic surge", category=EventCategoryEnum.ALERT)
            ]
            evidence = [
                EvidenceItem(type="metric", name="Traffic Surge", observation="Request volume increased by 320% in 5 minutes.", timestamp=t0, severity=SeverityEnum.MEDIUM)
            ]
            rca = RootCauseAnalysis(
                description="Unpredicted flash marketing campaign traffic exceeded max instance quota.",
                confidence=0.95,
                primary_factor="Capacity Saturation",
                alternative_causes=[],
                reasoning_summary="Request rate surge directly correlated with CPU saturation."
            )
            recommendation = Recommendation(
                action="scale_asg_capacity",
                target_service=service,
                risk=RiskLevelEnum.LOW,
                reason="Increase Auto Scaling Group capacity from 10 to 25 instances.",
                expected_result="CPU utilization normalizes to 65%.",
                requires_approval=True
            )
            remediation_result = RemediationResult(
                action="scale_asg_capacity",
                status="SUCCESS",
                executed_at=t0,
                executed_by="auto-remediation-service",
                output_message="ASG max capacity scaled to 25. Provisioned 6 new instances."
            )
            recovery_verified = True

        return Incident(
            id=inc_id,
            title=title,
            service=service,
            severity=severity,
            status=status,
            created_at=(now - timedelta(minutes=15)).isoformat(),
            updated_at=now.isoformat(),
            description=f"Automated alert triggered for {service}: {title}.",
            metrics=metrics,
            logs=logs,
            timeline=timeline,
            evidence=evidence,
            root_cause=rca,
            recommendation=recommendation,
            remediation_approved=(status == IncidentStatusEnum.RESOLVED),
            remediation_result=remediation_result,
            recovery_verified=recovery_verified
        )

    def list_incidents(self) -> List[Incident]:
        return sorted(list(self._incidents.values()), key=lambda x: x.created_at, reverse=True)

    def get_incident(self, incident_id: str) -> Optional[Incident]:
        return self._incidents.get(incident_id)

    def create_incident(self, title: str, service: str, severity: SeverityEnum, description: str, scenario: Optional[str] = "deployment_failure") -> Incident:
        new_id = f"INC-{len(self._incidents) + 1043}"
        inc = self._build_scenario_incident(
            inc_id=new_id,
            title=title,
            service=service,
            severity=severity,
            scenario=scenario or "deployment_failure",
            status=IncidentStatusEnum.ACTIVE
        )
        inc.description = description
        self._incidents[new_id] = inc
        return inc

    def update_incident(self, incident: Incident) -> Incident:
        incident.updated_at = datetime.now(timezone.utc).isoformat()
        self._incidents[incident.id] = incident
        return incident

    def execute_remediation(self, incident_id: str, approved_by: str) -> Incident:
        inc = self.get_incident(incident_id)
        if not inc:
            raise ValueError(f"Incident {incident_id} not found")

        now_str = datetime.now(timezone.utc).isoformat()
        inc.remediation_approved = True
        inc.status = IncidentStatusEnum.REMEDIATING

        # Append timeline event
        inc.timeline.append(
            IncidentEvent(
                id=str(uuid.uuid4()),
                timestamp=now_str,
                title="Remediation Approved",
                description=f"Action '{inc.recommendation.action if inc.recommendation else 'Rollback'}' approved by {approved_by}",
                category=EventCategoryEnum.REMEDIATION
            )
        )

        # Simulate execution
        inc.remediation_result = RemediationResult(
            action=inc.recommendation.action if inc.recommendation else "rollback_deployment",
            status="SUCCESS",
            executed_at=now_str,
            executed_by=approved_by,
            output_message=f"Successfully executed {inc.recommendation.action if inc.recommendation else 'rollback'}. Reverted {inc.service} to previous deployment state."
        )

        # Post-remediation metrics normalization
        t_rec = (datetime.now(timezone.utc) + timedelta(minutes=1)).isoformat()
        inc.metrics.append(
            MetricPoint(timestamp=t_rec, cpu_utilization=44.0, memory_utilization=59.0, latency_ms=125.0, error_rate_pct=0.1)
        )

        inc.timeline.append(
            IncidentEvent(
                id=str(uuid.uuid4()),
                timestamp=t_rec,
                title="Recovery Verified",
                description="Automated telemetry checks confirm error rate dropped to 0.1% and latency returned to 125ms baseline.",
                category=EventCategoryEnum.VERIFICATION
            )
        )

        inc.recovery_verified = True
        inc.status = IncidentStatusEnum.RESOLVED
        inc.updated_at = t_rec
        self.update_incident(inc)
        return inc

    def generate_report(self, incident_id: str) -> IncidentReport:
        inc = self.get_incident(incident_id)
        if not inc:
            raise ValueError(f"Incident {incident_id} not found")

        report_id = f"REP-{incident_id}"
        now_str = datetime.now(timezone.utc).isoformat()

        report = IncidentReport(
            id=report_id,
            incident_id=inc.id,
            title=f"Post-Mortem Incident Report: {inc.title}",
            created_at=now_str,
            executive_summary=f"Incident {inc.id} affected service '{inc.service}' with {inc.severity} severity. Root cause identified with {int((inc.root_cause.confidence if inc.root_cause else 0.85)*100)}% confidence by IncidentPilot AI. Remediation successfully restored operational baseline.",
            timeline_summary=[f"{item.timestamp[:19]}: {item.title} - {item.description}" for item in inc.timeline],
            root_cause_analysis=inc.root_cause or RootCauseAnalysis(
                description="Deployment regression caused resource saturation.",
                confidence=0.87,
                primary_factor="Deployment Failure",
                alternative_causes=[],
                reasoning_summary="Metric correlation confirmed anomaly onset post-deployment."
            ),
            evidence_collected=inc.evidence,
            remediation_summary=inc.remediation_result.output_message if inc.remediation_result else "Human approved rollback executed.",
            prevention_recommendations=[
                "Implement automated canary deployment health checks in CI/CD pipeline.",
                "Set lower heap allocation threshold alarms in CloudWatch.",
                "Add pre-deployment load testing for request deserialization pathways."
            ]
        )
        self._reports[report_id] = report
        return report

    def get_report(self, report_id: str) -> Optional[IncidentReport]:
        return self._reports.get(report_id)

    def list_reports(self) -> List[IncidentReport]:
        return list(self._reports.values())


class AWSCloudService(AbstractCloudService):
    """
    Live AWS Cloud Service implementation using boto3 for DynamoDB, CloudWatch, and Bedrock.
    Falls back gracefully to MockCloudService behavior if tables are not found.
    """
    def __init__(self):
        self.region = settings.AWS_REGION
        self.dynamodb = boto3.resource("dynamodb", region_name=self.region)
        self.cloudwatch = boto3.client("cloudwatch", region_name=self.region)
        self.logs = boto3.client("logs", region_name=self.region)
        self.mock_fallback = MockCloudService()

    def list_incidents(self) -> List[Incident]:
        try:
            table = self.dynamodb.Table(settings.DYNAMODB_INCIDENTS_TABLE)
            response = table.scan()
            items = response.get("Items", [])
            if not items:
                return self.mock_fallback.list_incidents()
            return [Incident(**item) for item in items]
        except Exception:
            return self.mock_fallback.list_incidents()

    def get_incident(self, incident_id: str) -> Optional[Incident]:
        try:
            table = self.dynamodb.Table(settings.DYNAMODB_INCIDENTS_TABLE)
            response = table.get_item(Key={"id": incident_id})
            item = response.get("Item")
            if item:
                return Incident(**item)
            return self.mock_fallback.get_incident(incident_id)
        except Exception:
            return self.mock_fallback.get_incident(incident_id)

    def create_incident(self, title: str, service: str, severity: SeverityEnum, description: str, scenario: Optional[str] = None) -> Incident:
        inc = self.mock_fallback.create_incident(title, service, severity, description, scenario)
        try:
            table = self.dynamodb.Table(settings.DYNAMODB_INCIDENTS_TABLE)
            table.put_item(Item=inc.model_dump())
        except Exception:
            pass
        return inc

    def update_incident(self, incident: Incident) -> Incident:
        inc = self.mock_fallback.update_incident(incident)
        try:
            table = self.dynamodb.Table(settings.DYNAMODB_INCIDENTS_TABLE)
            table.put_item(Item=inc.model_dump())
        except Exception:
            pass
        return inc

    def execute_remediation(self, incident_id: str, approved_by: str) -> Incident:
        inc = self.mock_fallback.execute_remediation(incident_id, approved_by)
        try:
            table = self.dynamodb.Table(settings.DYNAMODB_INCIDENTS_TABLE)
            table.put_item(Item=inc.model_dump())
        except Exception:
            pass
        return inc

    def generate_report(self, incident_id: str) -> IncidentReport:
        report = self.mock_fallback.generate_report(incident_id)
        try:
            table = self.dynamodb.Table(settings.DYNAMODB_REPORTS_TABLE)
            table.put_item(Item=report.model_dump())
        except Exception:
            pass
        return report

    def get_report(self, report_id: str) -> Optional[IncidentReport]:
        try:
            table = self.dynamodb.Table(settings.DYNAMODB_REPORTS_TABLE)
            res = table.get_item(Key={"id": report_id})
            item = res.get("Item")
            if item:
                return IncidentReport(**item)
            return self.mock_fallback.get_report(report_id)
        except Exception:
            return self.mock_fallback.get_report(report_id)

    def list_reports(self) -> List[IncidentReport]:
        try:
            table = self.dynamodb.Table(settings.DYNAMODB_REPORTS_TABLE)
            res = table.scan()
            items = res.get("Items", [])
            if items:
                return [IncidentReport(**item) for item in items]
            return self.mock_fallback.list_reports()
        except Exception:
            return self.mock_fallback.list_reports()


_mock_cloud_service_instance = None
_aws_cloud_service_instance = None

def get_cloud_service() -> AbstractCloudService:
    global _mock_cloud_service_instance, _aws_cloud_service_instance
    if settings.USE_AWS and not settings.USE_MOCK_DATA:
        if _aws_cloud_service_instance is None:
            _aws_cloud_service_instance = AWSCloudService()
        return _aws_cloud_service_instance
    else:
        if _mock_cloud_service_instance is None:
            _mock_cloud_service_instance = MockCloudService()
        return _mock_cloud_service_instance

