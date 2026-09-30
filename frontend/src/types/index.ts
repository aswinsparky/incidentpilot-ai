export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'ACTIVE' | 'INVESTIGATING' | 'PENDING_APPROVAL' | 'REMEDIATING' | 'RESOLVED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface MetricPoint {
  timestamp: string;
  cpu_utilization: number;
  memory_utilization: number;
  latency_ms: number;
  error_rate_pct: number;
}

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  message: string;
  service: string;
}

export interface IncidentEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: 'alert' | 'deployment' | 'telemetry' | 'ai_agent' | 'remediation' | 'verification';
  details?: Record<string, any>;
}

export interface EvidenceItem {
  type: string;
  name: string;
  observation: string;
  timestamp: string;
  severity: Severity;
}

export interface RootCauseAnalysis {
  description: string;
  confidence: number;
  primary_factor: string;
  alternative_causes: string[];
  reasoning_summary: string;
}

export interface Recommendation {
  action: string;
  target_service: string;
  risk: RiskLevel;
  reason: string;
  expected_result: string;
  requires_approval: boolean;
  parameters?: Record<string, any>;
}

export interface RemediationResult {
  action: string;
  status: string;
  executed_at: string;
  executed_by: string;
  output_message: string;
}

export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: Severity;
  status: IncidentStatus;
  created_at: string;
  updated_at: string;
  description: string;
  metrics: MetricPoint[];
  logs: LogEntry[];
  timeline: IncidentEvent[];
  evidence: EvidenceItem[];
  root_cause?: RootCauseAnalysis;
  recommendation?: Recommendation;
  remediation_approved: boolean;
  remediation_rejected?: boolean;
  remediation_result?: RemediationResult;
  recovery_verified: boolean;
}

export interface DashboardStats {
  active_incidents: number;
  resolved_today: number;
  mttr: string;
  ai_investigations_run: number;
  system_status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  services: {
    name: string;
    status: string;
    cpu_utilization: string;
    memory_utilization: string;
    latency: string;
    error_rate: string;
  }[];
}

export interface IncidentReport {
  id: string;
  incident_id: string;
  title: string;
  created_at: string;
  executive_summary: string;
  timeline_summary: string[];
  root_cause_analysis: RootCauseAnalysis;
  evidence_collected: EvidenceItem[];
  remediation_summary: string;
  prevention_recommendations: string[];
}
