-- ============================================================================
-- IMPACTLINK MASTER DATABASE MIGRATION: 003_indexes_and_triggers.sql
-- Indexes, Performance Optimizations & Automated Triggers
-- ============================================================================

-- Fast lookup indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_volunteer_profiles_city ON volunteer_profiles(city);
CREATE INDEX IF NOT EXISTS idx_volunteer_profiles_reliability ON volunteer_profiles(reliability_score DESC);
CREATE INDEX IF NOT EXISTS idx_volunteer_skills_skill_id ON volunteer_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_skills_volunteer_id ON volunteer_skills(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_city ON events(city);
CREATE INDEX IF NOT EXISTS idx_match_results_event ON match_results(event_id, match_score DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_event_status ON event_registrations(event_id, status);
CREATE INDEX IF NOT EXISTS idx_attendance_event ON attendance_records(event_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_deposits_org_status ON deposits(organization_id, status);

-- Auto-update updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_volunteer_profiles_updated_at ON volunteer_profiles;
CREATE TRIGGER trg_volunteer_profiles_updated_at BEFORE UPDATE ON volunteer_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_organizations_updated_at ON organizations;
CREATE TRIGGER trg_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_events_updated_at ON events;
CREATE TRIGGER trg_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_event_tasks_updated_at ON event_tasks;
CREATE TRIGGER trg_event_tasks_updated_at BEFORE UPDATE ON event_tasks FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Safe event registration counter trigger
CREATE OR REPLACE FUNCTION update_event_confirmed_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
        UPDATE events
        SET confirmed_count = (
            SELECT COUNT(*) FROM event_registrations
            WHERE event_id = NEW.event_id AND status = 'CONFIRMED'
        )
        WHERE id = NEW.event_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE events
        SET confirmed_count = (
            SELECT COUNT(*) FROM event_registrations
            WHERE event_id = OLD.event_id AND status = 'CONFIRMED'
        )
        WHERE id = OLD.event_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_event_registrations_count ON event_registrations;
CREATE TRIGGER trg_event_registrations_count
AFTER INSERT OR UPDATE OR DELETE ON event_registrations
FOR EACH ROW EXECUTE FUNCTION update_event_confirmed_count();

