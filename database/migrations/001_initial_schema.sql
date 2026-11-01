-- ============================================================================
-- IMPACTLINK MASTER DATABASE MIGRATION: 001_initial_schema.sql
-- Complete PostgreSQL Schema for ImpactLink Platform
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Types
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('VOLUNTEER', 'ORGANIZATION', 'ADMIN', 'TEAM_LEADER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE org_category_enum AS ENUM ('NGO', 'EDUCATIONAL_INSTITUTION', 'COMPANY', 'TRUST_SOCIETY', 'COMMUNITY_GROUP', 'INDIVIDUAL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE org_verification_status_enum AS ENUM ('PENDING', 'UNDER_REVIEW', 'MORE_INFO_REQUIRED', 'VERIFIED_NEW', 'ESTABLISHED_TRUSTED', 'REJECTED', 'SUSPENDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE event_category_enum AS ENUM ('ENVIRONMENTAL', 'EDUCATIONAL', 'HEALTH_AWARENESS', 'COMMUNITY_WELFARE', 'SOCIAL_SERVICE', 'SPORTS_RECREATION', 'PUBLIC_AWARENESS', 'DISASTER_RELIEF', 'OTHER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE event_status_enum AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'MORE_INFO_REQUIRED', 'APPROVED', 'REJECTED', 'PUBLISHED', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'EVENT_IN_PROGRESS', 'AWAITING_VERIFICATION', 'COMPLETED', 'CANCELLED', 'POSTPONED', 'DISPUTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE registration_status_enum AS ENUM ('APPLIED', 'PENDING_CONFIRMATION', 'CONFIRMED', 'WAITLISTED', 'REJECTED', 'CANCELLED', 'ATTENDED', 'NO_SHOW');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE attendance_status_enum AS ENUM ('NOT_CHECKED_IN', 'PRESENT', 'LATE', 'EXCUSED', 'ABSENT', 'MANUALLY_VERIFIED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE task_status_enum AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW', 'COMPLETED', 'REJECTED', 'REOPENED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE deposit_status_enum AS ENUM ('PENDING', 'PAID', 'REFUNDED', 'FORFEITED', 'EXEMPTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Profiles (Core identity mapped to auth or standalone authentication)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role user_role_enum NOT NULL DEFAULT 'VOLUNTEER',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Volunteer Profiles
CREATE TABLE IF NOT EXISTS volunteer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    bio TEXT,
    city VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    location_preference_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    reliability_score NUMERIC(5, 2) NOT NULL DEFAULT 70.00, -- Default provisional score
    is_provisional BOOLEAN NOT NULL DEFAULT TRUE,
    total_hours_volunteered NUMERIC(7, 2) NOT NULL DEFAULT 0.00,
    preferred_categories TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Skills Taxonomy
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL, -- Technical, Community, Environmental, Healthcare, Educational
    description TEXT,
    is_approved BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Volunteer Skills
CREATE TABLE IF NOT EXISTS volunteer_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    volunteer_id UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(20) DEFAULT 'INTERMEDIATE', -- BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    years_experience NUMERIC(4, 1) DEFAULT 1.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(volunteer_id, skill_id)
);

-- 5. Volunteer Availability
CREATE TABLE IF NOT EXISTS volunteer_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    volunteer_id UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
    day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_recurring BOOLEAN NOT NULL DEFAULT TRUE,
    specific_date DATE,
    temporary_unavailable BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Volunteer Experience
CREATE TABLE IF NOT EXISTS volunteer_experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    volunteer_id UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    organization_name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Organizations
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category org_category_enum NOT NULL DEFAULT 'NGO',
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    website VARCHAR(255),
    address TEXT,
    operating_location VARCHAR(200),
    representative_name VARCHAR(255) NOT NULL,
    representative_contact VARCHAR(100),
    description TEXT,
    verification_status org_verification_status_enum NOT NULL DEFAULT 'PENDING',
    trust_score NUMERIC(5, 2) NOT NULL DEFAULT 50.00,
    deposit_exempt BOOLEAN NOT NULL DEFAULT FALSE,
    completed_events_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Organization Documents
CREATE TABLE IF NOT EXISTS organization_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- REGISTRATION_CERT, NGO_DARPAN, CIN_LLPIN, ID_PROOF, ADDRESS_PROOF
    document_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'UPLOADED', -- UPLOADED, ANALYZED, APPROVED, REJECTED
    extracted_data JSONB DEFAULT '{}'::jsonb,
    ai_risk_score NUMERIC(5, 2) DEFAULT 0.00,
    ai_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Organization Verification Records
CREATE TABLE IF NOT EXISTS organization_verification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES profiles(id),
    review_status org_verification_status_enum NOT NULL,
    ai_risk_assessment JSONB DEFAULT '{}'::jsonb,
    reviewer_notes TEXT,
    reviewed_at TIMESTAMPTZ
);

-- 10. Organization Trust History
CREATE TABLE IF NOT EXISTS organization_trust_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    previous_score NUMERIC(5, 2) NOT NULL,
    new_score NUMERIC(5, 2) NOT NULL,
    factor_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Events
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category event_category_enum NOT NULL DEFAULT 'COMMUNITY_WELFARE',
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    volunteers_required INT NOT NULL DEFAULT 10,
    max_capacity INT NOT NULL DEFAULT 15,
    confirmed_count INT NOT NULL DEFAULT 0,
    status event_status_enum NOT NULL DEFAULT 'DRAFT',
    contact_person VARCHAR(200) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    safety_instructions TEXT,
    eligibility_requirements TEXT,
    banner_url TEXT,
    deposit_required_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    deposit_status deposit_status_enum NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Event Requirements (Skills & Qualifications)
CREATE TABLE IF NOT EXISTS event_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    is_mandatory BOOLEAN NOT NULL DEFAULT FALSE,
    min_experience_months INT DEFAULT 0
);

-- 13. Event Tasks
CREATE TABLE IF NOT EXISTS event_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    required_skills TEXT[] DEFAULT '{}',
    volunteers_needed INT NOT NULL DEFAULT 1,
    assigned_volunteers UUID[] DEFAULT '{}',
    deadline TIMESTAMPTZ,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, URGENT
    instructions TEXT,
    evidence_requirements TEXT,
    status task_status_enum NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Event Permissions (Organizers, Authorized Team Leaders)
CREATE TABLE IF NOT EXISTS event_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'TEAM_LEADER', -- TEAM_LEADER, AUDITOR, CO_ORGANIZER
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- 15. Event Reviews
CREATE TABLE IF NOT EXISTS event_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    review_type VARCHAR(50) NOT NULL, -- VOLUNTEER_TO_ORG, ORG_TO_VOLUNTEER
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    feedback_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. Match Results (AI volunteer-event matching table)
CREATE TABLE IF NOT EXISTS match_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    volunteer_id UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
    match_score NUMERIC(5, 2) NOT NULL,
    skill_score NUMERIC(5, 2) NOT NULL,
    location_score NUMERIC(5, 2) NOT NULL,
    availability_score NUMERIC(5, 2) NOT NULL,
    experience_score NUMERIC(5, 2) NOT NULL,
    reliability_score NUMERIC(5, 2) NOT NULL,
    explanation JSONB NOT NULL DEFAULT '{}'::jsonb,
    recommendation_category VARCHAR(50) DEFAULT 'HIGHLY_RECOMMENDED',
    notified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, volunteer_id)
);

-- 17. Matching Feedback
CREATE TABLE IF NOT EXISTS matching_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES match_results(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    feedback_type VARCHAR(50) NOT NULL, -- ACCEPTED, DECLINED_LOCATION, DECLINED_TIME, DECLINED_SKILL
    comments TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. Event Registrations
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    volunteer_id UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
    status registration_status_enum NOT NULL DEFAULT 'APPLIED',
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    notes TEXT,
    UNIQUE(event_id, volunteer_id)
);

-- 19. Waitlists
CREATE TABLE IF NOT EXISTS waitlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    volunteer_id UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
    position INT NOT NULL,
    offer_sent_at TIMESTAMPTZ,
    offer_expires_at TIMESTAMPTZ,
    status VARCHAR(50) NOT NULL DEFAULT 'WAITING', -- WAITING, OFFERED, ACCEPTED, EXPIRED
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, volunteer_id)
);

-- 20. Attendance Records
CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    volunteer_id UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
    status attendance_status_enum NOT NULL DEFAULT 'PRESENT',
    checked_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verified_by UUID REFERENCES profiles(id),
    check_in_method VARCHAR(50) NOT NULL DEFAULT 'QR_SCAN', -- QR_SCAN, MANUAL_ADMIN, MANUAL_TEAM_LEADER
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    token_used VARCHAR(255),
    UNIQUE(event_id, volunteer_id)
);

-- 21. Attendance Tokens (Cryptographically generated QR codes)
CREATE TABLE IF NOT EXISTS attendance_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 22. Task Submissions
CREATE TABLE IF NOT EXISTS task_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES event_tasks(id) ON DELETE CASCADE,
    volunteer_id UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
    description TEXT,
    status task_status_enum NOT NULL DEFAULT 'SUBMITTED',
    reviewer_notes TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- 23. Evidence Files
CREATE TABLE IF NOT EXISTS evidence_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES task_submissions(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- IMAGE, PDF, DOC
    file_name VARCHAR(255) NOT NULL,
    file_size INT,
    ai_duplicate_flag BOOLEAN NOT NULL DEFAULT FALSE,
    ai_similarity_score NUMERIC(5, 2) DEFAULT 0.00,
    ai_extracted_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 24. Verification Reviews
CREATE TABLE IF NOT EXISTS verification_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES task_submissions(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    verdict VARCHAR(50) NOT NULL, -- APPROVED, REJECTED, MORE_EVIDENCE
    comments TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 25. Volunteer Trust History
CREATE TABLE IF NOT EXISTS volunteer_trust_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    volunteer_id UUID NOT NULL REFERENCES volunteer_profiles(id) ON DELETE CASCADE,
    previous_score NUMERIC(5, 2) NOT NULL,
    new_score NUMERIC(5, 2) NOT NULL,
    factor_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 26. Deposits
CREATE TABLE IF NOT EXISTS deposits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status deposit_status_enum NOT NULL DEFAULT 'PENDING',
    payment_provider_reference VARCHAR(255),
    paid_at TIMESTAMPTZ,
    refund_eligible BOOLEAN NOT NULL DEFAULT FALSE,
    refunded_at TIMESTAMPTZ,
    terms_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 27. Payment Transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deposit_id UUID NOT NULL REFERENCES deposits(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- DEPOSIT, REFUND, PENALTY
    amount NUMERIC(10, 2) NOT NULL,
    provider_transaction_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'SUCCESS',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 28. Refunds
CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deposit_id UUID NOT NULL REFERENCES deposits(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    reason TEXT NOT NULL,
    admin_approved_by UUID REFERENCES profiles(id),
    status VARCHAR(50) NOT NULL DEFAULT 'PROCESSED',
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 29. Financial Audit Logs
CREATE TABLE IF NOT EXISTS financial_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL, -- DEPOSIT, REFUND, TRANSACTION
    entity_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2),
    performed_by UUID REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 30. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(100) NOT NULL,
    action_link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    channel VARCHAR(50) NOT NULL DEFAULT 'IN_APP', -- IN_APP, PUSH, EMAIL
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 31. Notification Preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    push_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    in_app_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    min_match_score NUMERIC(5, 2) NOT NULL DEFAULT 60.00,
    categories JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 32. Event Announcements
CREATE TABLE IF NOT EXISTS event_announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'NORMAL', -- NORMAL, URGENT
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 33. Admin Actions
CREATE TABLE IF NOT EXISTS admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL,
    target_type VARCHAR(100) NOT NULL,
    target_id UUID NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 34. System Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 35. User Reports
CREATE TABLE IF NOT EXISTS user_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reported_type VARCHAR(50) NOT NULL, -- USER, EVENT, ORGANIZATION, EVIDENCE
    reported_id UUID NOT NULL,
    reason VARCHAR(255) NOT NULL,
    details TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 36. Disputes
CREATE TABLE IF NOT EXISTS disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raised_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    related_entity_type VARCHAR(50) NOT NULL, -- DEPOSIT, ATTENDANCE, TASK, EVENT
    related_entity_id UUID NOT NULL,
    reason TEXT NOT NULL,
    evidence_urls JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    resolution_summary TEXT,
    resolved_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

