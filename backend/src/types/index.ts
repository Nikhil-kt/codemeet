export type UserRole = 'VOLUNTEER' | 'ORGANIZATION' | 'ADMIN' | 'TEAM_LEADER';

export type OrgCategory = 
  | 'NGO' 
  | 'EDUCATIONAL_INSTITUTION' 
  | 'COMPANY' 
  | 'TRUST_SOCIETY' 
  | 'COMMUNITY_GROUP' 
  | 'INDIVIDUAL';

export type OrgVerificationStatus = 
  | 'PENDING' 
  | 'UNDER_REVIEW' 
  | 'MORE_INFO_REQUIRED' 
  | 'VERIFIED_NEW' 
  | 'ESTABLISHED_TRUSTED' 
  | 'REJECTED' 
  | 'SUSPENDED';

export type EventCategory = 
  | 'ENVIRONMENTAL' 
  | 'EDUCATIONAL' 
  | 'HEALTH_AWARENESS' 
  | 'COMMUNITY_WELFARE' 
  | 'SOCIAL_SERVICE' 
  | 'SPORTS_RECREATION' 
  | 'PUBLIC_AWARENESS' 
  | 'DISASTER_RELIEF' 
  | 'OTHER';

export type EventStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'MORE_INFO_REQUIRED' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'PUBLISHED' 
  | 'REGISTRATION_OPEN' 
  | 'REGISTRATION_CLOSED' 
  | 'EVENT_IN_PROGRESS' 
  | 'AWAITING_VERIFICATION' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'POSTPONED' 
  | 'DISPUTED';

export type RegistrationStatus = 
  | 'APPLIED' 
  | 'PENDING_CONFIRMATION' 
  | 'CONFIRMED' 
  | 'WAITLISTED' 
  | 'REJECTED' 
  | 'CANCELLED' 
  | 'ATTENDED' 
  | 'NO_SHOW';

export type AttendanceStatus = 
  | 'NOT_CHECKED_IN' 
  | 'PRESENT' 
  | 'LATE' 
  | 'EXCUSED' 
  | 'ABSENT' 
  | 'MANUALLY_VERIFIED';

export type TaskStatus = 
  | 'OPEN' 
  | 'ASSIGNED' 
  | 'IN_PROGRESS' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'COMPLETED' 
  | 'REJECTED' 
  | 'REOPENED';

export type DepositStatus = 
  | 'PENDING' 
  | 'PAID' 
  | 'REFUNDED' 
  | 'FORFEITED' 
  | 'EXEMPTED';

export interface UserProfile {
  id: string;
  auth_user_id?: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  profileId: string;
  orgId?: string;
  volunteerId?: string;
}

