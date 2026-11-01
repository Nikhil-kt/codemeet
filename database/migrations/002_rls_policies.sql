-- ============================================================================
-- IMPACTLINK MASTER DATABASE MIGRATION: 002_rls_policies.sql
-- Row Level Security (RLS) Policies for ImpactLink Platform
-- ============================================================================

-- Enable RLS on core tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_trust_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS checks
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role_enum AS $$
  SELECT role FROM profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_profile_id()
RETURNS UUID AS $$
  SELECT id FROM profiles WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by authenticated users"
ON profiles FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE TO authenticated
USING (auth_user_id = auth.uid());

-- 2. Volunteer Profiles Policies
CREATE POLICY "Volunteers view own detailed profile"
ON volunteer_profiles FOR SELECT TO authenticated
USING (profile_id = current_profile_id() OR current_user_role() IN ('ADMIN', 'ORGANIZATION'));

CREATE POLICY "Volunteers update own profile"
ON volunteer_profiles FOR UPDATE TO authenticated
USING (profile_id = current_profile_id());

-- 3. Skills: Anyone can view approved skills
CREATE POLICY "Skills are viewable by all"
ON skills FOR SELECT TO authenticated
USING (is_approved = true);

-- 4. Organizations Policies
CREATE POLICY "Public can view verified organizations"
ON organizations FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Organizations update own record"
ON organizations FOR UPDATE TO authenticated
USING (profile_id = current_profile_id() OR current_user_role() = 'ADMIN');

-- 5. Organization Documents: Protected bucket access
CREATE POLICY "Orgs view and upload own documents"
ON organization_documents FOR ALL TO authenticated
USING (
  organization_id IN (SELECT id FROM organizations WHERE profile_id = current_profile_id())
  OR current_user_role() = 'ADMIN'
);

-- 6. Events Policies
CREATE POLICY "Published events are viewable by all authenticated users"
ON events FOR SELECT TO authenticated
USING (
  status IN ('PUBLISHED', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'EVENT_IN_PROGRESS', 'COMPLETED')
  OR organization_id IN (SELECT id FROM organizations WHERE profile_id = current_profile_id())
  OR current_user_role() = 'ADMIN'
);

CREATE POLICY "Organizations create and manage own events"
ON events FOR ALL TO authenticated
USING (
  organization_id IN (SELECT id FROM organizations WHERE profile_id = current_profile_id())
  OR current_user_role() = 'ADMIN'
);

-- 7. Registrations Policies
CREATE POLICY "Volunteers can view their registrations"
ON event_registrations FOR SELECT TO authenticated
USING (
  volunteer_id IN (SELECT id FROM volunteer_profiles WHERE profile_id = current_profile_id())
  OR event_id IN (SELECT id FROM events WHERE organization_id IN (SELECT id FROM organizations WHERE profile_id = current_profile_id()))
  OR current_user_role() = 'ADMIN'
);

CREATE POLICY "Volunteers can register for events"
ON event_registrations FOR INSERT TO authenticated
WITH CHECK (
  volunteer_id IN (SELECT id FROM volunteer_profiles WHERE profile_id = current_profile_id())
);

-- 8. Attendance Tokens: Organizers generate, volunteers cannot view raw secret hashes directly
CREATE POLICY "Organizers view attendance tokens for own events"
ON attendance_tokens FOR ALL TO authenticated
USING (
  event_id IN (SELECT id FROM events WHERE organization_id IN (SELECT id FROM organizations WHERE profile_id = current_profile_id()))
  OR current_user_role() = 'ADMIN'
);

-- 9. Attendance Records Policies
CREATE POLICY "Volunteers view own attendance; Organizers view event attendance"
ON attendance_records FOR SELECT TO authenticated
USING (
  volunteer_id IN (SELECT id FROM volunteer_profiles WHERE profile_id = current_profile_id())
  OR event_id IN (SELECT id FROM events WHERE organization_id IN (SELECT id FROM organizations WHERE profile_id = current_profile_id()))
  OR current_user_role() = 'ADMIN'
);

-- 10. Notifications Policies
CREATE POLICY "Users view and update their own notifications"
ON notifications FOR ALL TO authenticated
USING (user_id = current_profile_id());

-- 11. Disputes Policies
CREATE POLICY "Users view disputes they raised; Admin views all"
ON disputes FOR SELECT TO authenticated
USING (raised_by = current_profile_id() OR current_user_role() = 'ADMIN');

