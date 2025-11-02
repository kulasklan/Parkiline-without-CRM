-- =====================================================
-- SUPABASE DATABASE SETUP FOR PARKLINE CRM & ANALYTICS
-- =====================================================

-- 1. LEADS TABLE - Core lead management
CREATE TABLE leads (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    apartment VARCHAR(50),
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    assigned_to VARCHAR(100),
    budget DECIMAL(10,2),
    source VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. APARTMENTS TABLE - Property listings
CREATE TABLE apartments (
    id BIGSERIAL PRIMARY KEY,
    unit_number VARCHAR(20) UNIQUE NOT NULL,
    floor_number INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    square_meters DECIMAL(8,2),
    price_monthly DECIMAL(10,2),
    price_purchase DECIMAL(12,2),
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold', 'maintenance')),
    apartment_type VARCHAR(50),
    description TEXT,
    amenities TEXT[],
    images TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ANALYTICS EVENTS TABLE - Track user interactions
CREATE TABLE analytics_events (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    apartment_id BIGINT REFERENCES apartments(id),
    lead_id BIGINT REFERENCES leads(id),
    user_info JSONB,
    session_id VARCHAR(100),
    page_url VARCHAR(500),
    user_agent TEXT,
    ip_address INET,
    city VARCHAR(100),
    country VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TASKS TABLE - CRM task management
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    lead_id BIGINT REFERENCES leads(id),
    assigned_to VARCHAR(100) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    completed BOOLEAN DEFAULT FALSE,
    task_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ACTIVITIES TABLE - Track lead interactions and system activities
CREATE TABLE activities (
    id BIGSERIAL PRIMARY KEY,
    lead_id BIGINT REFERENCES leads(id),
    activity_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    performed_by VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. USERS TABLE - CRM users/agents
CREATE TABLE crm_users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'agent' CHECK (role IN ('admin', 'manager', 'agent')),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. LEAD HISTORY TABLE - Track lead status changes
CREATE TABLE lead_history (
    id BIGSERIAL PRIMARY KEY,
    lead_id BIGINT REFERENCES leads(id),
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    changed_by VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Leads indexes
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_email ON leads(email);

-- Analytics indexes
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_apartment_id ON analytics_events(apartment_id);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_session_id ON analytics_events(session_id);

-- Tasks indexes
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_lead_id ON tasks(lead_id);

-- Activities indexes
CREATE INDEX idx_activities_lead_id ON activities(lead_id);
CREATE INDEX idx_activities_created_at ON activities(created_at);

-- Apartments indexes
CREATE INDEX idx_apartments_status ON apartments(status);
CREATE INDEX idx_apartments_price_monthly ON apartments(price_monthly);

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample CRM users
INSERT INTO crm_users (full_name, email, role) VALUES
('Stefan Milosevski', 'stefan.m@parkline.mk', 'manager'),
('Ana Stojanovic', 'ana.s@parkline.mk', 'agent'),
('Marko Jovanovski', 'marko.j@parkline.mk', 'agent'),
('Elena Petrovic', 'elena.p@parkline.mk', 'agent');

-- Insert sample apartments
INSERT INTO apartments (unit_number, floor_number, bedrooms, bathrooms, square_meters, price_monthly, price_purchase, apartment_type, description) VALUES
('A-1204', 12, 2, 1, 80.5, 2500.00, 180000.00, 'Standard', 'Modern 2BR apartment with city view'),
('B-2401', 24, 3, 2, 120.0, 4200.00, 320000.00, 'Penthouse', 'Luxury penthouse with panoramic views'),
('C-805', 8, 1, 1, 55.0, 1800.00, 135000.00, 'Studio Plus', 'Cozy apartment with balcony'),
('A-602', 6, 2, 1, 75.0, 2100.00, 165000.00, 'Standard', 'Bright apartment with garden view'),
('B-1501', 15, 2, 2, 95.0, 2800.00, 215000.00, 'Premium', 'Premium apartment with modern amenities');

-- Insert sample leads
INSERT INTO leads (name, email, phone, apartment, status, priority, assigned_to, budget, source, notes) VALUES
('Maria Petrovic', 'maria.p@email.com', '+389 70 123 456', 'A-1204', 'new', 'high', 'Stefan Milosevski', 2500.00, 'Website', 'Interested in immediate viewing'),
('Aleksandar Kostov', 'alex.k@email.com', '+389 71 234 567', 'B-2401', 'qualified', 'high', 'Ana Stojanovic', 4200.00, 'Referral', 'Ready to make decision this week'),
('Jana Mladenovska', 'jana.m@email.com', '+389 72 345 678', 'C-805', 'contacted', 'medium', 'Marko Jovanovski', 1800.00, 'Facebook', 'First-time buyer, needs guidance'),
('Stefan Dimitriev', 'stefan.d@email.com', '+389 73 456 789', 'A-602', 'new', 'medium', 'Elena Petrovic', 2100.00, 'Google Ads', 'Comparing multiple properties'),
('Petra Nikolovska', 'petra.n@email.com', '+389 74 567 890', 'B-1501', 'closed', 'low', 'Stefan Milosevski', 2800.00, 'Walk-in', 'Deal closed successfully');

-- Insert sample tasks
INSERT INTO tasks (title, description, lead_id, assigned_to, due_date, priority, task_type) VALUES
('Follow up with Maria Petrovic', 'Schedule apartment viewing and discuss financing options', 1, 'Stefan Milosevski', NOW() + INTERVAL '2 hours', 'high', 'follow_up'),
('Send proposal to Aleksandar K.', 'Prepare detailed proposal with pricing and terms', 2, 'Ana Stojanovic', NOW() + INTERVAL '1 day', 'high', 'proposal'),
('Schedule apartment viewing', 'Coordinate viewing time with Jana M.', 3, 'Marko Jovanovski', NOW() + INTERVAL '1 day', 'medium', 'viewing'),
('Call Stefan Dimitriev', 'Discuss property features and answer questions', 4, 'Elena Petrovic', NOW() + INTERVAL '4 hours', 'high', 'call');

-- Insert sample activities
INSERT INTO activities (lead_id, activity_type, description, performed_by) VALUES
(1, 'lead_created', 'New lead registered from website', 'System'),
(1, 'email_sent', 'Welcome email sent to lead', 'Stefan Milosevski'),
(2, 'status_changed', 'Lead moved from contacted to qualified', 'Ana Stojanovic'),
(3, 'viewing_requested', 'Lead requested apartment viewing', 'Jana Mladenovska'),
(4, 'email_opened', 'Lead opened marketing email', 'System'),
(5, 'deal_closed', 'Successfully closed deal', 'Stefan Milosevski');

-- Insert sample analytics events
INSERT INTO analytics_events (event_type, apartment_id, user_info, session_id, page_url, city, country) VALUES
('apartment_view', 1, '{"user_type": "visitor", "source": "organic"}', 'sess_001', '/apartment/A-1204', 'Skopje', 'Macedonia'),
('contact_form', 2, '{"user_type": "lead", "source": "paid"}', 'sess_002', '/apartment/B-2401', 'Skopje', 'Macedonia'),
('filter_applied', NULL, '{"filters": {"bedrooms": 2, "price_max": 2500}}', 'sess_003', '/search', 'Prilep', 'Macedonia'),
('virtual_tour', 3, '{"duration": 180}', 'sess_004', '/apartment/C-805', 'Bitola', 'Macedonia'),
('photo_gallery', 1, '{"photos_viewed": 8}', 'sess_005', '/apartment/A-1204', 'Skopje', 'Macedonia'),
('brochure_download', 4, '{"document": "floor_plan"}', 'sess_006', '/apartment/A-602', 'Ohrid', 'Macedonia');

-- =====================================================
-- USEFUL VIEWS FOR ANALYTICS
-- =====================================================

-- Lead pipeline summary
CREATE VIEW lead_pipeline_summary AS
SELECT 
    status,
    COUNT(*) as lead_count,
    SUM(budget) as total_value,
    AVG(budget) as avg_value
FROM leads 
GROUP BY status;

-- Daily analytics summary
CREATE VIEW daily_analytics_summary AS
SELECT 
    DATE(created_at) as date,
    event_type,
    COUNT(*) as event_count,
    COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_events 
GROUP BY DATE(created_at), event_type
ORDER BY date DESC;

-- Top performing apartments
CREATE VIEW top_apartments AS
SELECT 
    a.unit_number,
    a.apartment_type,
    a.price_monthly,
    COUNT(ae.id) as total_views,
    COUNT(DISTINCT ae.session_id) as unique_visitors
FROM apartments a
LEFT JOIN analytics_events ae ON a.id = ae.apartment_id
WHERE ae.event_type = 'apartment_view'
GROUP BY a.id, a.unit_number, a.apartment_type, a.price_monthly
ORDER BY total_views DESC;

-- Agent performance
CREATE VIEW agent_performance AS
SELECT 
    assigned_to as agent,
    COUNT(*) as total_leads,
    COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_deals,
    ROUND(
        COUNT(CASE WHEN status = 'closed' THEN 1 END) * 100.0 / COUNT(*), 2
    ) as conversion_rate,
    SUM(CASE WHEN status = 'closed' THEN budget ELSE 0 END) as total_revenue
FROM leads 
WHERE assigned_to IS NOT NULL
GROUP BY assigned_to;

-- =====================================================
-- ROW LEVEL SECURITY (Optional but recommended)
-- =====================================================

-- Enable RLS on tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Example policies (adjust based on your auth system)
-- CREATE POLICY "Users can view leads assigned to them" ON leads
--     FOR SELECT USING (assigned_to = auth.jwt() ->> 'email');

-- CREATE POLICY "Users can update leads assigned to them" ON leads
--     FOR UPDATE USING (assigned_to = auth.jwt() ->> 'email');

-- =====================================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- =====================================================

-- Function to log lead activities
CREATE OR REPLACE FUNCTION log_lead_activity(
    p_lead_id BIGINT,
    p_activity_type VARCHAR(50),
    p_description TEXT,
    p_performed_by VARCHAR(100) DEFAULT NULL
)
RETURNS BIGINT AS $$
DECLARE
    activity_id BIGINT;
BEGIN
    INSERT INTO activities (lead_id, activity_type, description, performed_by)
    VALUES (p_lead_id, p_activity_type, p_description, p_performed_by)
    RETURNING id INTO activity_id;
    
    RETURN activity_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update lead status and log history
CREATE OR REPLACE FUNCTION update_lead_status(
    p_lead_id BIGINT,
    p_new_status VARCHAR(20),
    p_changed_by VARCHAR(100),
    p_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    old_status VARCHAR(20);
BEGIN
    -- Get current status
    SELECT status INTO old_status FROM leads WHERE id = p_lead_id;
    
    -- Update lead status
    UPDATE leads SET 
        status = p_new_status,
        updated_at = NOW()
    WHERE id = p_lead_id;
    
    -- Log history
    INSERT INTO lead_history (lead_id, old_status, new_status, changed_by, notes)
    VALUES (p_lead_id, old_status, p_new_status, p_changed_by, p_notes);
    
    -- Log activity
    PERFORM log_lead_activity(
        p_lead_id, 
        'status_changed', 
        'Status changed from ' || old_status || ' to ' || p_new_status,
        p_changed_by
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- REALTIME SUBSCRIPTIONS SETUP
-- =====================================================

-- To enable realtime updates in your frontend, run these in Supabase Dashboard:
-- SELECT cron.schedule('update-analytics', '*/5 minutes', 'REFRESH MATERIALIZED VIEW IF EXISTS analytics_summary;');

-- Add realtime to tables you want to subscribe to:
-- ALTER PUBLICATION supabase_realtime ADD TABLE leads;
-- ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
-- ALTER PUBLICATION supabase_realtime ADD TABLE activities;
-- ALTER PUBLICATION supabase_realtime ADD TABLE analytics_events;