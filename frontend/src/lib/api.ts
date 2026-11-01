import { auth as firebaseAuthInstance } from './firebase';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
  try {
    let token = typeof window !== 'undefined' ? localStorage.getItem('impactlink_token') : null;

    // Check if Firebase client has an active user ID token
    if (typeof window !== 'undefined') {
      try {
        const currentUser = firebaseAuthInstance?.currentUser;
        if (currentUser) {
          token = await currentUser.getIdToken();
          localStorage.setItem('impactlink_token', token);
        }
      } catch (e) {}
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Request failed',
        error: data.error,
        data,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Network error connecting to ImpactLink server.',
    };
  }
}

export const api = {
  // Auth
  register: (payload: any) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (credentials: any) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  me: () => apiRequest('/auth/me'),
  forgotPassword: (email: string) => apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (new_password: string) => apiRequest('/auth/reset-password', { method: 'POST', body: JSON.stringify({ new_password }) }),
  resendVerification: (email: string) => apiRequest('/auth/resend-verification', { method: 'POST', body: JSON.stringify({ email }) }),

  // Organizations
  getMyOrg: () => apiRequest('/organization/me'),
  updateMyOrg: (payload: any) => apiRequest('/organization/me', { method: 'PUT', body: JSON.stringify(payload) }),
  uploadOrgDocument: (payload: any) => apiRequest('/organization/documents', { method: 'POST', body: JSON.stringify(payload) }),
  uploadOrgDoc: (payload: any) => apiRequest('/organization/documents', { method: 'POST', body: JSON.stringify(payload) }),
  getOrgStats: () => apiRequest('/organization/stats'),

  // Volunteers
  getVolunteerProfile: () => apiRequest('/volunteer/me'),
  updateVolunteerProfile: (payload: any) => apiRequest('/volunteer/me', { method: 'PUT', body: JSON.stringify(payload) }),
  updateSkills: (skills: any[]) => apiRequest('/volunteer/skills', { method: 'POST', body: JSON.stringify({ skills }) }),
  updateAvailability: (slots: any[]) => apiRequest('/volunteer/availability', { method: 'POST', body: JSON.stringify({ slots }) }),
  getVolunteerHistory: () => apiRequest('/volunteer/history'),
  getSkillsCatalog: () => apiRequest('/volunteer/skills-catalog'),

  // Events & Registration
  getEvents: (params?: Record<string, any> | string) => {
    let q = '';
    if (typeof params === 'string') {
      q = params ? (params.startsWith('?') ? params : '?' + params) : '';
    } else if (params) {
      q = '?' + new URLSearchParams(params).toString();
    }
    return apiRequest(`/events${q}`);
  },
  getEvent: (id: string) => apiRequest(`/events/${id}`),
  getEventById: (id: string) => apiRequest(`/events/${id}`),
  createEvent: (payload: any) => apiRequest('/events', { method: 'POST', body: JSON.stringify(payload) }),
  submitEvent: (eventId: string) => apiRequest(`/events/${eventId}/submit`, { method: 'POST' }),
  registerForEvent: (eventId: string, notes?: string) =>
    apiRequest(`/events/${eventId}/register`, { method: 'POST', body: JSON.stringify({ notes }) }),
  cancelRegistration: (eventId: string) =>
    apiRequest(`/events/${eventId}/register`, { method: 'DELETE' }),
  getEventVolunteers: (eventId: string) =>
    apiRequest(`/events/${eventId}/volunteers`),

  // Attendance, QR & Check-In
  generateQR: (eventId: string, validitySeconds = 60) =>
    apiRequest('/attendance/generate-qr', { method: 'POST', body: JSON.stringify({ eventId, validitySeconds }) }),
  checkInQR: (payload: { eventId?: string; token: string; code?: string; specialCode?: string; latitude?: number; longitude?: number }) =>
    apiRequest('/attendance/checkin', { method: 'POST', body: JSON.stringify(payload) }),
  getMyCertificates: () => apiRequest('/attendance/certificates/my'),
  getEventCertificate: (eventId: string) => apiRequest(`/attendance/events/${eventId}/certificate`),

  // AI Matching
  matchVolunteers: (eventId: string) => apiRequest(`/matching/event/${eventId}`),
  notifyMatches: (eventId: string, threshold = 65) =>
    apiRequest(`/matching/event/${eventId}/notify`, { method: 'POST', body: JSON.stringify({ threshold }) }),

  // Tasks & Evidence Submission
  getEventTasks: (eventId: string) => apiRequest(`/tasks/events/${eventId}`),
  submitTaskEvidence: (taskIdOrPayload: string | any, payload?: any) => {
    if (typeof taskIdOrPayload === 'string') {
      return apiRequest(`/tasks/${taskIdOrPayload}/submit`, { method: 'POST', body: JSON.stringify(payload || {}) });
    }
    return apiRequest(`/tasks/evidence`, { method: 'POST', body: JSON.stringify(taskIdOrPayload) });
  },
  reviewTaskSubmission: (submissionId: string, status: string, feedback?: string) =>
    apiRequest(`/tasks/submissions/${submissionId}/review`, { method: 'POST', body: JSON.stringify({ status, feedback }) }),

  // Admin Governance
  getAdminStats: () => apiRequest('/admin/stats'),
  getAdminOrgs: (status?: string) => apiRequest(`/admin/organizations${status ? `?status=${status}` : ''}`),
  reviewOrg: (orgId: string, status: string, adminNotes?: string) =>
    apiRequest(`/admin/organizations/${orgId}/review`, { method: 'POST', body: JSON.stringify({ status, adminNotes }) }),
  getAdminEvents: () => apiRequest('/admin/events'),
  reviewEvent: (eventId: string, status: string, adminNotes?: string) =>
    apiRequest(`/admin/events/${eventId}/review`, { method: 'POST', body: JSON.stringify({ status, adminNotes }) }),
  getDeposits: () => apiRequest('/admin/deposits'),
  requestRefund: (depositId: string) => apiRequest(`/deposits/${depositId}/refund`, { method: 'POST' }),
  returnDeposit: (orgId: string, amount: number) =>
    apiRequest(`/admin/deposits/${orgId}/refund`, { method: 'POST', body: JSON.stringify({ amount }) }),
};
