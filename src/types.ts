export type IncidentCategory =
  | 'accident'
  | 'bullying'
  | 'facility'
  | 'fire_electric'
  | 'suspicious_person'
  | 'contraband'
  | 'health_sanitation'
  | 'other';

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export type IncidentStatus =
  | 'pending'
  | 'investigating'
  | 'in_progress'
  | 'resolved'
  | 'dismissed';

export interface TimelineEntry {
  id: string;
  status: IncidentStatus;
  message: string;
  timestamp: string;
  officer?: string;
}

export interface IncidentReport {
  id: string; // e.g. SCH-2025-0104
  title: string;
  category: IncidentCategory;
  urgency: UrgencyLevel;
  locationZone: string;
  locationDetail: string;
  dateTime: string;
  description: string;
  imageUrl?: string;
  isAnonymous: boolean;
  reporterName?: string;
  reporterRole?: 'นักเรียน' | 'ครู/บุคลากร' | 'ผู้ปกครอง' | 'บุคคลภายนอก';
  reporterContact?: string;
  status: IncidentStatus;
  assignedDepartment?: string;
  assignedOfficer?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEntry[];
}

export interface CategoryInfo {
  id: IncidentCategory;
  label: string;
  description: string;
  iconName: string;
  colorClass: string;
}

export interface UrgencyInfo {
  id: UrgencyLevel;
  label: string;
  badgeClass: string;
  description: string;
}

export interface StatusInfo {
  id: IncidentStatus;
  label: string;
  badgeClass: string;
  borderClass: string;
  bgLightClass: string;
}

export interface HotlineContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  availableHours: string;
  isExternal?: boolean;
  badge?: string;
}
