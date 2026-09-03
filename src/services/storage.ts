import { INITIAL_INCIDENT_REPORTS } from '../data/mockData';
import { IncidentReport, IncidentStatus, TimelineEntry } from '../types';

const STORAGE_KEY = 'school_safety_reports_v1';

// In-memory fallback if localStorage fails or throws
let memoryReports: IncidentReport[] = [...INITIAL_INCIDENT_REPORTS];

export const getIncidentReports = (): IncidentReport[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INCIDENT_REPORTS));
      return INITIAL_INCIDENT_REPORTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_INCIDENT_REPORTS;
  } catch {
    return memoryReports;
  }
};

export const saveAllReports = (reports: IncidentReport[]): void => {
  memoryReports = [...reports];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    window.dispatchEvent(new Event('school_safety_data_change'));
  } catch (err) {
    console.warn('Storage save fallback to memory:', err);
  }
};

export const addIncidentReport = (report: IncidentReport): void => {
  const current = getIncidentReports();
  const updated = [report, ...current];
  saveAllReports(updated);
};

export const updateIncidentReport = (
  id: string,
  update: {
    status?: IncidentStatus;
    assignedDepartment?: string;
    assignedOfficer?: string;
    adminNotes?: string;
    newTimelineMessage?: string;
  }
): IncidentReport | null => {
  const current = getIncidentReports();
  const index = current.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const existing = current[index];
  const now = new Date();
  const thaiTimestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} น.`;

  const newTimeline: TimelineEntry[] = [...existing.timeline];

  if (update.newTimelineMessage) {
    newTimeline.push({
      id: `tl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: update.status || existing.status,
      message: update.newTimelineMessage,
      timestamp: thaiTimestamp,
      officer: update.assignedOfficer || existing.assignedOfficer,
    });
  }

  const updatedReport: IncidentReport = {
    ...existing,
    status: update.status ?? existing.status,
    assignedDepartment: update.assignedDepartment ?? existing.assignedDepartment,
    assignedOfficer: update.assignedOfficer ?? existing.assignedOfficer,
    adminNotes: update.adminNotes ?? existing.adminNotes,
    updatedAt: now.toISOString(),
    timeline: newTimeline,
  };

  current[index] = updatedReport;
  saveAllReports(current);
  return updatedReport;
};

export const deleteIncidentReport = (id: string): boolean => {
  const current = getIncidentReports();
  const filtered = current.filter((r) => r.id !== id);
  if (filtered.length !== current.length) {
    saveAllReports(filtered);
    return true;
  }
  return false;
};

export const resetToInitialReports = (): IncidentReport[] => {
  saveAllReports(INITIAL_INCIDENT_REPORTS);
  return INITIAL_INCIDENT_REPORTS;
};

export const generateIncidentId = (): string => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `SCH-${year}-${randomNum}`;
};
