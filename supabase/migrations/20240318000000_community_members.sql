-- Create enum for member roles
CREATE TYPE member_role AS ENUM ('donor', 'volunteer');

-- Create community_members table
CREATE TABLE community_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    role member_role NOT NULL,
    image_url TEXT,
    occupation VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donor_activities table
CREATE TABLE donor_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID REFERENCES community_members(id) ON DELETE CASCADE,
    food_item_id UUID REFERENCES food_items(id) ON DELETE SET NULL,
    donation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'completed',
    CONSTRAINT donor_activities_donor_role CHECK (
        EXISTS (
            SELECT 1 FROM community_members 
            WHERE id = donor_id AND role = 'donor'
        )
    )
);

-- Create volunteer_activities table
CREATE TABLE volunteer_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    volunteer_id UUID REFERENCES community_members(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    completion_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'completed',
    CONSTRAINT volunteer_activities_volunteer_role CHECK (
        EXISTS (
            SELECT 1 FROM community_members 
            WHERE id = volunteer_id AND role = 'volunteer'
        )
    )
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating timestamp
CREATE TRIGGER update_community_members_updated_at
    BEFORE UPDATE ON community_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for donors
INSERT INTO community_members (name, role, occupation, image_url) VALUES
    ('Emma Wilson', 'donor', 'Local Restaurant Owner', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100'),
    ('Michael Chen', 'donor', 'Grocery Store Manager', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100'),
    ('Sarah Johnson', 'donor', 'Community Baker', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100');

-- Insert sample data for volunteers
INSERT INTO community_members (name, role, occupation, image_url) VALUES
    ('David Park', 'volunteer', 'Delivery Volunteer', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100'),
    ('Lisa Martinez', 'volunteer', 'Food Sorting Lead', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100'),
    ('James Wilson', 'volunteer', 'Community Coordinator', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100');

-- Create views for recent donors and active volunteers
CREATE VIEW recent_donors AS
SELECT 
    cm.id,
    cm.name,
    cm.occupation,
    cm.image_url,
    COUNT(da.id) as donation_count
FROM community_members cm
LEFT JOIN donor_activities da ON cm.id = da.donor_id
WHERE cm.role = 'donor'
GROUP BY cm.id, cm.name, cm.occupation, cm.image_url
ORDER BY COUNT(da.id) DESC, cm.created_at DESC
LIMIT 10;

CREATE VIEW active_volunteers AS
SELECT 
    cm.id,
    cm.name,
    cm.occupation,
    cm.image_url,
    COUNT(va.id) as task_count
FROM community_members cm
LEFT JOIN volunteer_activities va ON cm.id = va.volunteer_id
WHERE cm.role = 'volunteer'
GROUP BY cm.id, cm.name, cm.occupation, cm.image_url
ORDER BY COUNT(va.id) DESC, cm.created_at DESC
LIMIT 10;

-- Create RLS policies
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_activities ENABLE ROW LEVEL SECURITY;

-- Policy for viewing community members
CREATE POLICY "Community members are viewable by everyone"
ON community_members FOR SELECT
TO public
USING (true);

-- Policy for viewing donor activities
CREATE POLICY "Donor activities are viewable by everyone"
ON donor_activities FOR SELECT
TO public
USING (true);

-- Policy for viewing volunteer activities
CREATE POLICY "Volunteer activities are viewable by everyone"
ON volunteer_activities FOR SELECT
TO public
USING (true); 