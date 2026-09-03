import {
  IncidentReport,
  IncidentStatus,
} from '../types';

/**
 * Google Apps Script Web App
 */
const GAS_URL =
  'https://script.google.com/macros/s/AKfycbyzDkgF4W7b9NRzs6qMYZVUYsvU3kwX4IcmiMjHHoILT59N43XzL1mHZaYKSsUXcdfN/exec';

/**
 * เรียก Google Apps Script แบบ POST
 */
const postToGAS = async <T = unknown>(
  payload: Record<string, unknown>
): Promise<T> => {
  const response = await fetch(GAS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      `Google Apps Script HTTP Error: ${response.status}`
    );
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(
      result.error || 'Google Apps Script ทำงานไม่สำเร็จ'
    );
  }

  return result.data as T;
};

/**
 * โหลดรายการแจ้งเหตุทั้งหมดจาก Google Sheets
 */
export const getIncidentReports =
  async (): Promise<IncidentReport[]> => {
    const url =
      `${GAS_URL}?action=getReports`;

    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(
        `Google Apps Script HTTP Error: ${response.status}`
      );
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(
        result.error || 'ไม่สามารถโหลดข้อมูลแจ้งเหตุได้'
      );
    }

    return Array.isArray(result.data)
      ? result.data
      : [];
  };

/**
 * เพิ่มรายการแจ้งเหตุใหม่
 */
export const addIncidentReport =
  async (
    report: IncidentReport
  ): Promise<IncidentReport> => {
    const savedReport =
      await postToGAS<IncidentReport>({
        action: 'add',
        data: report,
      });

    window.dispatchEvent(
      new Event('school_safety_data_change')
    );

    return savedReport;
  };

/**
 * อัปเดตรายการแจ้งเหตุ
 */
export const updateIncidentReport =
  async (
    id: string,
    update: {
      status?: IncidentStatus;
      assignedDepartment?: string;
      assignedOfficer?: string;
      adminNotes?: string;
      newTimelineMessage?: string;
    }
  ): Promise<IncidentReport> => {
    if (!id) {
      throw new Error('ไม่พบ ID ของรายงาน');
    }

    const updatedReport =
      await postToGAS<IncidentReport>({
        action: 'update',
        id,
        update,
      });

    window.dispatchEvent(
      new Event('school_safety_data_change')
    );

    return updatedReport;
  };

/**
 * ลบรายการแจ้งเหตุ
 */
export const deleteIncidentReport =
  async (
    id: string
  ): Promise<boolean> => {
    if (!id) {
      throw new Error('ไม่พบ ID ของรายงาน');
    }

    const result =
      await postToGAS<boolean>({
        action: 'delete',
        id,
      });

    window.dispatchEvent(
      new Event('school_safety_data_change')
    );

    return Boolean(result);
  };

/**
 * รีเซ็ตข้อมูลใน Google Sheets
 */
export const resetToInitialReports =
  async (): Promise<IncidentReport[]> => {
    const reports =
      await postToGAS<IncidentReport[]>({
        action: 'reset',
      });

    window.dispatchEvent(
      new Event('school_safety_data_change')
    );

    return Array.isArray(reports)
      ? reports
      : [];
  };

/**
 * สร้างรหัสแจ้งเหตุ
 *
 * ตัวอย่าง:
 * SCH-2026-1234
 */
export const generateIncidentId = (): string => {
  const year = new Date().getFullYear();

  const randomNum = Math.floor(
    1000 + Math.random() * 9000
  );

  return `SCH-${year}-${randomNum}`;
};
