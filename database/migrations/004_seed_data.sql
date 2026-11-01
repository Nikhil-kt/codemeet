-- ============================================================================
-- IMPACTLINK MASTER DATABASE MIGRATION: 004_seed_data.sql
-- Initial Skills Taxonomy & Baseline Demo Records
-- ============================================================================

-- Standard Skills Taxonomy
INSERT INTO skills (id, name, category, description, is_approved) VALUES
-- Environmental
('a0000000-0000-0000-0000-000000000001', 'Tree Planting', 'Environmental', 'Knowledge of sapling plantation, soil aeration and maintenance', true),
('a0000000-0000-0000-0000-000000000002', 'Waste Segregation & Recycling', 'Environmental', 'Sorting biodegradable, dry recyclables and hazardous waste', true),
('a0000000-0000-0000-0000-000000000003', 'Beach & Water Body Cleanup', 'Environmental', 'Coastal clean-up techniques, safety gear handling and collection', true),
('a0000000-0000-0000-0000-000000000004', 'Environmental Awareness', 'Environmental', 'Conducting public talks and school workshops on conservation', true),

-- Community & Coordination
('a0000000-0000-0000-0000-000000000005', 'Event Management', 'Community', 'Crowd flow, logistics coordination, and venue management', true),
('a0000000-0000-0000-0000-000000000006', 'Public Speaking & Emceeing', 'Community', 'Addressing gatherings, hosting community sessions and announcements', true),
('a0000000-0000-0000-0000-000000000007', 'Volunteer Coordination', 'Community', 'Leading volunteer squads and guiding task completions', true),

-- Healthcare & Safety
('a0000000-0000-0000-0000-000000000008', 'First Aid & CPR', 'Healthcare', 'Certified basic life support, wound dressing, and triage support', true),
('a0000000-0000-0000-0000-000000000009', 'Health Camp Assistance', 'Healthcare', 'Patient registration, vitals recording and medicine distribution assistance', true),
('a0000000-0000-0000-0000-000000000010', 'Mental Health Support', 'Healthcare', 'Empathetic listening and community counselling support', true),

-- Educational
('a0000000-0000-0000-0000-000000000011', 'Remedial Teaching & Tutoring', 'Educational', 'Teaching foundational mathematics, science, or English to students', true),
('a0000000-0000-0000-0000-000000000012', 'Youth Mentoring', 'Educational', 'Career counseling, digital literacy, and personal development guidance', true),

-- Technical
('a0000000-0000-0000-0000-000000000013', 'Photography & Videography', 'Technical', 'High-res event documentation, editing, and photojournalism', true),
('a0000000-0000-0000-0000-000000000014', 'Social Media & Content Creation', 'Technical', 'Live tweeting, reels creation, press briefs, and impact storytelling', true),
('a0000000-0000-0000-0000-000000000015', 'Web Development', 'Technical', 'Building landing pages, community forms, and tech infrastructure', true)
ON CONFLICT (name) DO NOTHING;

-- Demo Profiles
-- 1. System Admin
INSERT INTO profiles (id, email, full_name, phone, role) VALUES
('b0000000-0000-0000-0000-000000000001', 'admin@impactlink.org', 'Chief Administrator', '+91 98765 43210', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- 2. Demo Organization Profile
INSERT INTO profiles (id, email, full_name, phone, role) VALUES
('b0000000-0000-0000-0000-000000000002', 'contact@greenearthtrust.org', 'Ananya Sharma', '+91 98111 22334', 'ORGANIZATION')
ON CONFLICT (email) DO NOTHING;

INSERT INTO organizations (id, profile_id, name, category, email, phone, website, address, operating_location, representative_name, representative_contact, description, verification_status, trust_score, deposit_exempt, completed_events_count) VALUES
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Green Earth Trust', 'NGO', 'contact@greenearthtrust.org', '+91 98111 22334', 'https://greenearthtrust.org', '12 Marina Coastal Road, Chennai', 'Chennai, Tamil Nadu', 'Ananya Sharma', '+91 98111 22334', 'Dedicated to urban reforestation, beach cleanliness and water sanctuary conservation.', 'VERIFIED_NEW', 78.50, false, 2)
ON CONFLICT (profile_id) DO NOTHING;

-- 3. Demo Volunteer Profiles
-- Volunteer 1: Rahul (Beach cleanup expert, nearby)
INSERT INTO profiles (id, email, full_name, phone, role) VALUES
('b0000000-0000-0000-0000-000000000003', 'rahul.kumar@gmail.com', 'Rahul Kumar', '+91 99887 76655', 'VOLUNTEER')
ON CONFLICT (email) DO NOTHING;

INSERT INTO volunteer_profiles (id, profile_id, bio, city, district, state, postal_code, latitude, longitude, reliability_score, is_provisional, total_hours_volunteered, preferred_categories) VALUES
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'Passionate environmentalist and community coordinator.', 'Chennai', 'Chennai', 'Tamil Nadu', '600004', 13.0336, 80.2785, 92.00, false, 48.0, ARRAY['ENVIRONMENTAL', 'COMMUNITY_WELFARE'])
ON CONFLICT (profile_id) DO NOTHING;

INSERT INTO volunteer_skills (volunteer_id, skill_id, proficiency_level, years_experience) VALUES
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'ADVANCED', 3.0),
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'EXPERT', 4.0)
ON CONFLICT DO NOTHING;

-- Volunteer 2: Priya (Provisional newcomer, enthusiastic teacher & healthcare aid)
INSERT INTO profiles (id, email, full_name, phone, role) VALUES
('b0000000-0000-0000-0000-000000000004', 'priya.s@outlook.com', 'Priya Sundaram', '+91 98450 11223', 'VOLUNTEER')
ON CONFLICT (email) DO NOTHING;

INSERT INTO volunteer_profiles (id, profile_id, bio, city, district, state, postal_code, latitude, longitude, reliability_score, is_provisional, total_hours_volunteered, preferred_categories) VALUES
('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'Educator and first aid volunteer passionate about child literacy.', 'Chennai', 'Chennai', 'Tamil Nadu', '600020', 13.0067, 80.2565, 75.00, true, 8.0, ARRAY['EDUCATIONAL', 'HEALTH_AWARENESS'])
ON CONFLICT (profile_id) DO NOTHING;

INSERT INTO volunteer_skills (volunteer_id, skill_id, proficiency_level, years_experience) VALUES
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000011', 'ADVANCED', 2.0),
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000008', 'BEGINNER', 1.0)
ON CONFLICT DO NOTHING;

