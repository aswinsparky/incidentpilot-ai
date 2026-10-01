import { Incident, DashboardStats, IncidentReport } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://pir5gqzb66.execute-api.us-east-1.amazonaws.com/api';

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return await res.json();
  } catch (err) {
    return {
      active_incidents: 1,
      resolved_today: 8,
      mttr: '8m 21s',
      ai_investigations_run: 12,
      system_status: 'DEGRADED',
      services: [
        { name: 'production-api', status: 'DEGRADED', cpu_utilization: '78%', memory_utilization: '94%', latency: '2,800ms', error_rate: '18.5%' },
        { name: 'user-db-cluster', status: 'HEALTHY', cpu_utilization: '42%', memory_utilization: '55%', latency: '45ms', error_rate: '0.0%' },
        { name: 'checkout-service', status: 'HEALTHY', cpu_utilization: '38%', memory_utilization: '52%', latency: '95ms', error_rate: '0.0%' }
      ]
    };
  }
}

export async function fetchIncidents(): Promise<Incident[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/incidents`);
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function fetchIncident(id: string): Promise<Incident | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/incidents/${id}`);
    if (!res.ok) throw new Error('Incident not found');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function triggerInvestigation(id: string): Promise<Incident> {
  const res = await fetch(`${API_BASE_URL}/incidents/${id}/investigate`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Investigation failed');
  // Return refetched incident
  const updated = await fetchIncident(id);
  if (!updated) throw new Error('Failed to refetch incident');
  return updated;
}

export async function approveRemediation(id: string, approvedBy: string = 'sre-lead@company.com'): Promise<Incident> {
  const res = await fetch(`${API_BASE_URL}/incidents/${id}/approve?approved_by=${encodeURIComponent(approvedBy)}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Approval failed');
  return await res.json();
}

export async function simulateDemoIncident(scenario: string = 'deployment_failure'): Promise<Incident> {
  const res = await fetch(`${API_BASE_URL}/demo/simulate?scenario=${scenario}`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Demo simulation failed');
  return await res.json();
}

export async function fetchReports(): Promise<IncidentReport[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/reports`);
    if (!res.ok) throw new Error('Failed to fetch reports');
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function fetchReport(reportId: string): Promise<IncidentReport | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/reports/${reportId}`);
    if (!res.ok) throw new Error('Report not found');
    return await res.json();
  } catch (err) {
    return null;
  }
}
