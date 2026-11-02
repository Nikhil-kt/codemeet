import { v4 as uuidv4 } from 'uuid';
import { UserRole, OrgCategory, OrgVerificationStatus, EventCategory, EventStatus, RegistrationStatus, AttendanceStatus, TaskStatus, DepositStatus } from '../types';

export class MemoryStore {
  public profiles: any[] = [];
  public volunteer_profiles: any[] = [];
  public skills: any[] = [];
  public volunteer_skills: any[] = [];
  public volunteer_availability: any[] = [];
  public organizations: any[] = [];
  public organization_documents: any[] = [];
  public events: any[] = [];
  public event_requirements: any[] = [];
  public event_tasks: any[] = [];
  public match_results: any[] = [];
  public event_registrations: any[] = [];
  public waitlists: any[] = [];
  public attendance_records: any[] = [];
  public attendance_tokens: any[] = [];
  public certificates: any[] = [];
  public task_submissions: any[] = [];
  public evidence_files: any[] = [];
  public verification_reviews: any[] = [];
  public deposits: any[] = [];
  public notifications: any[] = [];
  public disputes: any[] = [];
  public audit_logs: any[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    // 1. Skills
    this.skills = [
      { id: 'a0000000-0000-0000-0000-000000000001', name: 'Tree Planting', category: 'Environmental', is_approved: true },
      { id: 'a0000000-0000-0000-0000-000000000002', name: 'Waste Segregation & Recycling', category: 'Environmental', is_approved: true },
      { id: 'a0000000-0000-0000-0000-000000000003', name: 'Beach & Water Body Cleanup', category: 'Environmental', is_approved: true },
      { id: 'a0000000-0000-0000-0000-000000000004', name: 'Environmental Awareness', category: 'Environmental', is_approved: true },
      { id: 'a0000000-0000-0000-0000-000000000005', name: 'Event Management', category: 'Community', is_approved: true },
      { id: 'a0000000-0000-0000-0000-000000000006', name: 'Public Speaking & Emceeing', category: 'Community', is_approved: true },
      { id: 'a0000000-0000-0000-0000-000000000007', name: 'Volunteer Coordination', category: 'Community', is_approved: true },
      { id: 'a0000000-0000-0000-0000-000000000008', name: 'First Aid & CPR', category: 'Healthcare', is_approved: true },
      { id: 'a0000000-0000-0000-0000-000000000009', name: 'Health Camp Assistance', category: 'Healthcare', is_approved: true },
      { id: 'a0000000-0000-0000-0000-000000000010', name: 'Mental Health Support', category: 'Healthcare', is_approved: true },
      { id: 'a0000000-0000-0000-0000-000000000011', name: 'Remedial Teaching & Tutoring', category: 'Educational', is_approved: true },
      { id: 'a0000000-0000-0000-0000-000000000012', name: 'Youth Mentoring', category: 'Educational', is_approved: true },
      { id: 'a0000000-0000-0000-0000-000000000013', name: 'Photography & Videography', category: 'Technical', is_approved: true },
      { id: 'a0000000-0000-0000-0000-000000000014', name: 'Social Media & Content Creation', category: 'Technical', is_approved: true },
      { id: 'a0000000-0000-0000-0000-000000000015', name: 'Web Development', category: 'Technical', is_approved: true }
    ];

    // 2. Profiles
    this.profiles = [
      {
        id: 'b0000000-0000-0000-0000-000000000001',
        email: 'admin@impactlink.org',
        full_name: 'Chief Administrator',
        phone: '+91 98765 43210',
        role: 'ADMIN' as UserRole,
        password_hash: '$2a$10$WkGk75mOq4f23O7qDkG9cOPb5d8gKq2W3J9Jc71u9sX8Q9c8Q9c8Q', // hashed 'admin123'
        created_at: new Date().toISOString()
      },
      {
        id: 'b0000000-0000-0000-0000-000000000002',
        email: 'contact@greenearthtrust.org',
        full_name: 'Ananya Sharma',
        phone: '+91 98111 22334',
        role: 'ORGANIZATION' as UserRole,
        password_hash: '$2a$10$WkGk75mOq4f23O7qDkG9cOPb5d8gKq2W3J9Jc71u9sX8Q9c8Q9c8Q',
        created_at: new Date().toISOString()
      },
      {
        id: 'b0000000-0000-0000-0000-000000000003',
        email: 'rahul.kumar@gmail.com',
        full_name: 'Rahul Kumar',
        phone: '+91 99887 76655',
        role: 'VOLUNTEER' as UserRole,
        password_hash: '$2a$10$WkGk75mOq4f23O7qDkG9cOPb5d8gKq2W3J9Jc71u9sX8Q9c8Q9c8Q',
        created_at: new Date().toISOString()
      },
      {
        id: 'b0000000-0000-0000-0000-000000000004',
        email: 'priya.s@outlook.com',
        full_name: 'Priya Sundaram',
        phone: '+91 98450 11223',
        role: 'VOLUNTEER' as UserRole,
        password_hash: '$2a$10$WkGk75mOq4f23O7qDkG9cOPb5d8gKq2W3J9Jc71u9sX8Q9c8Q9c8Q',
        created_at: new Date().toISOString()
      }
    ];

    // 3. Organization
    this.organizations = [
      {
        id: 'c0000000-0000-0000-0000-000000000001',
        profile_id: 'b0000000-0000-0000-0000-000000000002',
        name: 'Green Earth Trust',
        category: 'NGO' as OrgCategory,
        email: 'contact@greenearthtrust.org',
        phone: '+91 98111 22334',
        website: 'https://greenearthtrust.org',
        address: '12 Marina Coastal Road, Chennai',
        operating_location: 'Chennai, Tamil Nadu',
        representative_name: 'Ananya Sharma',
        representative_contact: '+91 98111 22334',
        description: 'Dedicated to urban reforestation, beach cleanliness and water sanctuary conservation.',
        verification_status: 'VERIFIED_NEW' as OrgVerificationStatus,
        trust_score: 78.50,
        deposit_exempt: false,
        completed_events_count: 2,
        created_at: new Date().toISOString()
      }
    ];

    // 4. Volunteer Profiles
    this.volunteer_profiles = [
      {
        id: 'd0000000-0000-0000-0000-000000000001',
        profile_id: 'b0000000-0000-0000-0000-000000000003',
        bio: 'Passionate environmentalist and community coordinator.',
        city: 'Chennai',
        district: 'Chennai',
        state: 'Tamil Nadu',
        postal_code: '600004',
        latitude: 13.0336,
        longitude: 80.2785,
        location_preference_enabled: true,
        reliability_score: 92.00,
        is_provisional: false,
        total_hours_volunteered: 48.0,
        preferred_categories: ['ENVIRONMENTAL', 'COMMUNITY_WELFARE'],
        created_at: new Date().toISOString()
      },
      {
        id: 'd0000000-0000-0000-0000-000000000002',
        profile_id: 'b0000000-0000-0000-0000-000000000004',
        bio: 'Educator and first aid volunteer passionate about child literacy.',
        city: 'Chennai',
        district: 'Chennai',
        state: 'Tamil Nadu',
        postal_code: '600020',
        latitude: 13.0067,
        longitude: 80.2565,
        location_preference_enabled: true,
        reliability_score: 75.00,
        is_provisional: true,
        total_hours_volunteered: 8.0,
        preferred_categories: ['EDUCATIONAL', 'HEALTH_AWARENESS'],
        created_at: new Date().toISOString()
      }
    ];

    // 5. Volunteer Skills
    this.volunteer_skills = [
      { id: uuidv4(), volunteer_id: 'd0000000-0000-0000-0000-000000000001', skill_id: 'a0000000-0000-0000-0000-000000000003', proficiency_level: 'ADVANCED', years_experience: 3.0 },
      { id: uuidv4(), volunteer_id: 'd0000000-0000-0000-0000-000000000001', skill_id: 'a0000000-0000-0000-0000-000000000002', proficiency_level: 'EXPERT', years_experience: 4.0 },
      { id: uuidv4(), volunteer_id: 'd0000000-0000-0000-0000-000000000001', skill_id: 'a0000000-0000-0000-0000-000000000001', proficiency_level: 'INTERMEDIATE', years_experience: 1.0 },
      { id: uuidv4(), volunteer_id: 'd0000000-0000-0000-0000-000000000002', skill_id: 'a0000000-0000-0000-0000-000000000011', proficiency_level: 'ADVANCED', years_experience: 2.0 },
      { id: uuidv4(), volunteer_id: 'd0000000-0000-0000-0000-000000000002', skill_id: 'a0000000-0000-0000-0000-000000000008', proficiency_level: 'BEGINNER', years_experience: 1.0 }
    ];

    // 6. Volunteer Availability
    this.volunteer_availability = [
      { id: uuidv4(), volunteer_id: 'd0000000-0000-0000-0000-000000000001', day_of_week: 6, start_time: '06:00:00', end_time: '12:00:00', is_recurring: true },
      { id: uuidv4(), volunteer_id: 'd0000000-0000-0000-0000-000000000002', day_of_week: 6, start_time: '08:00:00', end_time: '14:00:00', is_recurring: true }
    ];

    // 7. Initial Demonstration Event
    this.events = [
      {
        id: 'e0000000-0000-0000-0000-000000000001',
        organization_id: 'c0000000-0000-0000-0000-000000000001',
        title: 'Marina Beach Mega Coastal Cleanup & Segregation Drive',
        description: 'Join us to restore Marina Beach! Volunteers will clear microplastics, segregate dry waste, and set up eco-awareness bins along the coastline.',
        category: 'ENVIRONMENTAL' as EventCategory,
        event_date: '2026-11-14',
        start_time: '06:30:00',
        end_time: '10:30:00',
        location_name: 'Marina Beach Light House Promenade',
        address: 'Kamarajar Promenade, Triplicane, Chennai',
        city: 'Chennai',
        latitude: 13.0475,
        longitude: 80.2824,
        volunteers_required: 15,
        max_capacity: 25,
        confirmed_count: 1,
        status: 'PUBLISHED' as EventStatus,
        secret_code: 'IMP-2026',
        check_in_code: 'IMP-2026',
        active_check_in_code: 'IMP-2026',
        contact_person: 'Ananya Sharma',
        contact_phone: '+91 98111 22334',
        safety_instructions: 'Gloves, eco-bags, and drinking water provided. Please wear sturdy walking shoes and sun protection.',
        eligibility_requirements: 'Open to all age 16+. Enthusiastic mindset and environmental consciousness.',
        deposit_required_amount: 0.00,
        deposit_status: 'EXEMPTED' as DepositStatus,
        created_at: new Date().toISOString()
      }
    ];

    // 8. Event Requirements
    this.event_requirements = [
      { id: uuidv4(), event_id: 'e0000000-0000-0000-0000-000000000001', skill_id: 'a0000000-0000-0000-0000-000000000003', is_mandatory: true, min_experience_months: 1 },
      { id: uuidv4(), event_id: 'e0000000-0000-0000-0000-000000000001', skill_id: 'a0000000-0000-0000-0000-000000000002', is_mandatory: false, min_experience_months: 0 }
    ];

    // 9. Event Tasks
    this.event_tasks = [
      {
        id: 't0000000-0000-0000-0000-000000000001',
        event_id: 'e0000000-0000-0000-0000-000000000001',
        title: 'North Promenade Coastal Plastic Clearance',
        description: 'Clear shoreline debris between Light House and Vivekanandar Illam. Collect into color-coded sacks.',
        required_skills: ['Beach & Water Body Cleanup'],
        volunteers_needed: 5,
        assigned_volunteers: ['d0000000-0000-0000-0000-000000000001'],
        deadline: '2026-11-14T09:30:00Z',
        priority: 'HIGH',
        instructions: 'Work in pairs. Photograph the weighing scale when bags are filled.',
        evidence_requirements: 'Photo of collected sacks and geo-tagged shoreline area.',
        status: 'ASSIGNED' as TaskStatus,
        created_at: new Date().toISOString()
      }
    ];

    // 10. Initial Confirmed Registration for Rahul
    this.event_registrations = [
      {
        id: 'r0000000-0000-0000-0000-000000000001',
        event_id: 'e0000000-0000-0000-0000-000000000001',
        volunteer_id: 'd0000000-0000-0000-0000-000000000001',
        status: 'CONFIRMED' as RegistrationStatus,
        registered_at: new Date().toISOString(),
        confirmed_at: new Date().toISOString(),
        notes: 'Experienced volunteer confirmed by organizer.'
      }
    ];

    // 11. Initial Deposit Record for Green Earth Trust
    this.deposits = [
      {
        id: 'dep00000-0000-0000-0000-000000000001',
        organization_id: 'c0000000-0000-0000-0000-000000000001',
        event_id: 'e0000000-0000-0000-0000-000000000001',
        amount: 5000.00,
        currency: 'INR',
        status: 'PAID' as DepositStatus,
        payment_provider_reference: 'pay_sim_99881122',
        paid_at: new Date().toISOString(),
        refund_eligible: false,
        terms_accepted: true,
        created_at: new Date().toISOString()
      }
    ];
  }
}

export const db = new MemoryStore();
