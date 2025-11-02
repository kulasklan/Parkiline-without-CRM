// ParkLine CRM System - Main Application
class CRMApp {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.currentView = 'dashboard';
        this.leads = [];
        this.crmUsers = [];
        this.tasks = [];
        this.activities = [];
        this.apartments = [];
        this.currentLead = null;
        this.isLoading = false;
        this.useRealDatabase = false; // Set to true when real Supabase is configured
    }

    // Initialize the CRM application - NO LOGIN VERSION
    async initialize() {
        console.log('🚀 Starting ParkLine CRM (No Login Demo)...');
        
        try {
            // Skip all authentication - go straight to dashboard
            this.currentUser = {
                id: 1,
                email: 'demo@izostone.mk',
                full_name: 'Demo User',
                role: 'admin',
                is_active: true
            };

            // Hide login screen immediately
            const loginScreen = document.querySelector('.login-screen');
            if (loginScreen) {
                loginScreen.style.display = 'none';
            }

            // Show dashboard and load data
            this.showDashboard();
            await this.loadInitialData();
            
            console.log('✅ Demo CRM loaded - no login required');
            
        } catch (error) {
            console.error('❌ Failed to initialize CRM:', error);
            // Skip error popup for demo
        }
    }

    // Initialize Supabase client - simplified for demo
    async initializeSupabase() {
        // For demo purposes, we'll simulate authentication without Supabase
        this.supabase = {
            auth: {
                getSession: () => Promise.resolve({ data: { session: null } }),
                signInWithPassword: async ({ email, password }) => {
                    // Demo authentication logic
                    if (email === 'admin@izostone.mk' && password === 'admin123') {
                        return { data: { user: { email: 'admin@izostone.mk' } }, error: null };
                    }
                    return { data: null, error: { message: 'Invalid login credentials' } };
                },
                signOut: () => Promise.resolve({ error: null }),
                onAuthStateChange: (callback) => {
                    // Store callback for manual triggering
                    this.authCallback = callback;
                }
            },
            from: (table) => ({
                select: (fields) => ({
                    eq: (column, value) => ({
                        single: () => this.mockDatabaseQuery(table, 'select', { fields, eq: { column, value }, single: true }),
                        order: (orderBy, options) => this.mockDatabaseQuery(table, 'select', { fields, eq: { column, value }, order: { orderBy, options } })
                    }),
                    order: (orderBy, options) => this.mockDatabaseQuery(table, 'select', { fields, order: { orderBy, options } })
                }),
                insert: (data) => ({
                    select: () => this.mockDatabaseQuery(table, 'insert', { data })
                }),
                update: (data) => ({
                    eq: (column, value) => this.mockDatabaseQuery(table, 'update', { data, eq: { column, value } })
                })
            })
        };
        
        console.log('✅ Demo CRM client initialized');
    }

    // Mock database query function for demo
    async mockDatabaseQuery(table, operation, params) {
        try {
            // Since we're in a browser environment, we'll use fetch to call our server
            // For this demo, we'll return mock data based on the table
            
            if (table === 'leads') {
                if (operation === 'select') {
                    return { 
                        data: await this.fetchLeadsData(), 
                        error: null 
                    };
                }
            }
            
            if (table === 'crm_users') {
                return { 
                    data: [
                        { id: 1, full_name: 'Demo Admin', email: 'admin@izostone.mk', role: 'admin' },
                        { id: 2, full_name: 'Sales Manager', email: 'sales@izostone.mk', role: 'manager' },
                        { id: 3, full_name: 'John Smith', email: 'agent1@izostone.mk', role: 'agent' }
                    ], 
                    error: null 
                };
            }
            
            if (table === 'lead_notes') {
                return { 
                    data: [], 
                    error: null 
                };
            }
            
            return { data: [], error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    // Fetch leads data (mock for demo)
    async fetchLeadsData() {
        return [
            {
                id: 1, name: 'Maria Stefanovska', email: 'maria.s@email.mk', 
                phone: '+389 70 123 456', apartment_id: '2.14', status: 'qualified', 
                priority: 'high', created_at: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
                assigned_to: 1, assigned_user: { full_name: 'Demo Admin' }
            },
            {
                id: 2, name: 'Petar Nikolov', email: 'petar.n@gmail.com', 
                phone: '+389 71 234 567', apartment_id: '3.8', status: 'proposal', 
                priority: 'medium', created_at: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
                assigned_to: 2, assigned_user: { full_name: 'Sales Manager' }
            },
            {
                id: 3, name: 'Ana Dimitrova', email: 'ana.d@yahoo.com', 
                phone: '+389 72 345 678', apartment_id: '1.5', status: 'negotiation', 
                priority: 'urgent', created_at: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
                assigned_to: 1, assigned_user: { full_name: 'Demo Admin' }
            },
            {
                id: 4, name: 'Stefan Popov', email: 'stefan.popov@email.mk', 
                phone: '+389 75 456 789', apartment_id: 'ДП.0.3', status: 'contacted', 
                priority: 'low', created_at: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
                assigned_to: 3, assigned_user: { full_name: 'John Smith' }
            },
            {
                id: 5, name: 'Elena Trajkovska', email: 'elena.t@outlook.com', 
                phone: '+389 76 567 890', apartment_id: '3.12', status: 'closed_won', 
                priority: 'high', created_at: new Date(Date.now() - 10*24*60*60*1000).toISOString(),
                assigned_to: 1, assigned_user: { full_name: 'Demo Admin' }
            },
            {
                id: 6, name: 'Jovana Stojanovic', email: 'jovana.s@email.mk', 
                phone: null, apartment_id: null, status: 'new', 
                priority: 'low', created_at: new Date(Date.now() - 1*60*60*1000).toISOString(),
                assigned_to: null, assigned_user: null
            },
            {
                id: 7, name: 'Aleksandar Mitrovic', email: 'alex.m@company.mk', 
                phone: '+389 78 789 012', apartment_id: '2.10', status: 'qualified', 
                priority: 'urgent', created_at: new Date(Date.now() - 4*24*60*60*1000).toISOString(),
                assigned_to: 2, assigned_user: { full_name: 'Sales Manager' }
            }
        ];
    }

    // Setup authentication state listener
    setupAuthListener() {
        this.supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('🔐 Auth state changed:', event);
            
            if (event === 'SIGNED_IN' && session) {
                await this.handleAuthenticatedUser(session.user);
            } else if (event === 'SIGNED_OUT') {
                this.handleSignOut();
            }
        });
    }

    // Handle authenticated user - simplified for demo
    async handleAuthenticatedUser(user) {
        console.log('👤 User authenticated:', user.email);
        
        // Simulate CRM user data for demo
        this.currentUser = {
            id: 1,
            email: 'admin@izostone.mk',
            full_name: 'Demo Admin',
            role: 'admin',
            is_active: true
        };

        this.showDashboard();
        await this.loadInitialData();
    }

    // Handle sign out
    handleSignOut() {
        this.currentUser = null;
        this.leads = [];
        this.crmUsers = [];
        this.showLoginScreen();
    }

// Show login screen
showLoginScreen() {
    // Add this line here to clear any previous messages
    this.showLoginMessage('', ''); // <--- ADD THIS LINE

    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('crmDashboard').style.display = 'none';
    document.getElementById('loadingOverlay').style.display = 'none';

    // Setup login form
    this.setupLoginForm();
}

    // Show dashboard
    showDashboard() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('crmDashboard').style.display = 'block';
        document.getElementById('loadingOverlay').style.display = 'none';
        
        // Update user info in header
        document.getElementById('currentUserName').textContent = this.currentUser.full_name;
    }

    // Setup login form
    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        const loginMessage = document.getElementById('loginMessage');
        
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                this.showLoginMessage('Please enter both email and password', 'error');
                return;
            }
            
            try {
                this.showLoading('Signing in...');
                
                const { data, error } = await this.supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });
                
                if (error) {
                    throw error;
                }
                
                this.showLoginMessage('Login successful!', 'success');
                
            } catch (error) {
                console.error('❌ Login error:', error);
                this.hideLoading();
                
                let errorMessage = 'Login failed. Please check your credentials.';
                if (error.message.includes('Invalid login credentials')) {
                    errorMessage = 'Invalid email or password. Please try again.';
                } else if (error.message.includes('Email not confirmed')) {
                    errorMessage = 'Please confirm your email address before signing in.';
                }
                
                this.showLoginMessage(errorMessage, 'error');
            }
        });
    }

    // Show login message
    showLoginMessage(message, type) {
        const loginMessage = document.getElementById('loginMessage');
        loginMessage.textContent = message;
        loginMessage.className = `login-message ${type}`;
    }

    // Load initial data for dashboard - NO LOGIN VERSION
    async loadInitialData() {
        try {
            console.log('🔄 Loading demo CRM data...');
            
            // Load demo data (enhanced with new features)
            await this.loadEnhancedDemoData();
            
            console.log('✅ Enhanced CRM data loaded successfully');
            
        } catch (error) {
            console.error('❌ Failed to load CRM data:', error);
        }
    }

    // Load enhanced demo data with new features
    async loadEnhancedDemoData() {
        // Load apartments data
        this.apartments = [
            { id: 1, unit_number: 'А-1204', floor_number: 12, bedrooms: 2, price_monthly: 2500, status: 'available', apartment_type: 'Стандарден' },
            { id: 2, unit_number: 'Б-2401', floor_number: 24, bedrooms: 3, price_monthly: 4200, status: 'available', apartment_type: 'Пентхаус' },
            { id: 3, unit_number: 'В-805', floor_number: 8, bedrooms: 1, price_monthly: 1800, status: 'reserved', apartment_type: 'Студио+' },
            { id: 4, unit_number: 'А-602', floor_number: 6, bedrooms: 2, price_monthly: 2100, status: 'available', apartment_type: 'Стандарден' },
            { id: 5, unit_number: 'Б-1501', floor_number: 15, bedrooms: 2, price_monthly: 2800, status: 'sold', apartment_type: 'Премиум' }
        ];

        // Load enhanced leads data
        this.leads = [
                {
                    id: 1,
                    name: 'Марина Петровска',
                    email: 'marina.p@email.com',
                    phone: '+389 70 123 456',
                    apartment_id: 'А-1204',
                    status: 'new',
                    priority: 'high',
                    assigned_to: 'Stefan Milosevski',
                    budget: 2500.00,
                    source: 'Website',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    notes: 'Интересирана за непосредно гледање на стан'
                },
                {
                    id: 2,
                    name: 'Александар Костов',
                    email: 'aleksandar.k@email.com',
                    phone: '+389 71 234 567',
                    apartment_id: 'Б-2401',
                    status: 'qualified',
                    priority: 'high',
                    assigned_to: 'Ana Stojanovic',
                    budget: 4200.00,
                    source: 'Referral',
                    created_at: new Date(Date.now() - 86400000).toISOString(),
                    updated_at: new Date(Date.now() - 43200000).toISOString(),
                    notes: 'Подготвен да донесе одлука оваа недела'
                },
                {
                    id: 3,
                    name: 'Јана Младеновска',
                    email: 'jana.m@email.com',
                    phone: '+389 72 345 678',
                    apartment_id: 'В-805',
                    status: 'contacted',
                    priority: 'medium',
                    assigned_to: 'Marko Jovanovski',
                    budget: 1800.00,
                    source: 'Facebook',
                    created_at: new Date(Date.now() - 172800000).toISOString(),
                    updated_at: new Date(Date.now() - 86400000).toISOString(),
                    notes: 'Прв пат купува стан, потребно водење'
                },
                {
                    id: 4,
                    name: 'Стефан Димитриев',
                    email: 'stefan.d@email.com',
                    phone: '+389 73 456 789',
                    apartment_id: 'А-602',
                    status: 'new',
                    priority: 'medium',
                    assigned_to: 'Elena Petrovic',
                    budget: 2100.00,
                    source: 'Google Ads',
                    created_at: new Date(Date.now() - 259200000).toISOString(),
                    updated_at: new Date(Date.now() - 172800000).toISOString(),
                    notes: 'Споредува повеќе недвижности'
                },
                {
                    id: 5,
                    name: 'Петра Николовска',
                    email: 'petra.n@email.com',
                    phone: '+389 74 567 890',
                    apartment_id: 'Б-1501',
                    status: 'closed_won',
                    priority: 'low',
                    assigned_to: 'Stefan Milosevski',
                    budget: 2800.00,
                    source: 'Walk-in',
                    created_at: new Date(Date.now() - 604800000).toISOString(),
                    updated_at: new Date(Date.now() - 86400000).toISOString(),
                    notes: 'Договор успешно завршен'
                }
            ];

            // Load tasks data
            this.tasks = [
                {
                    id: 1,
                    title: 'Контакт со Марина П.',
                    description: 'Закажи гледање на стан и дискутирај финансиски опции',
                    lead_id: 1,
                    assigned_to: 'Stefan Milosevski',
                    due_date: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
                    priority: 'high',
                    completed: false,
                    task_type: 'follow_up',
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    title: 'Испрати понуда до Александар К.',
                    description: 'Подготви детална понуда со цени и услови',
                    lead_id: 2,
                    assigned_to: 'Ana Stojanovic',
                    due_date: new Date(Date.now() + 86400000).toISOString(), // 1 day
                    priority: 'high',
                    completed: false,
                    task_type: 'proposal',
                    created_at: new Date().toISOString()
                },
                {
                    id: 3,
                    title: 'Закажи гледање стан',
                    description: 'Координирај време за гледање со Јана М.',
                    lead_id: 3,
                    assigned_to: 'Marko Jovanovski',
                    due_date: new Date(Date.now() + 86400000).toISOString(),
                    priority: 'medium',
                    completed: false,
                    task_type: 'viewing',
                    created_at: new Date().toISOString()
                }
            ];

            // Load activities data
            this.activities = [
                {
                    id: 1,
                    lead_id: 1,
                    activity_type: 'lead_created',
                    description: 'Нов потенцијален клиент регистриран од веб-сајт',
                    performed_by: 'System',
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    lead_id: 1,
                    activity_type: 'email_sent',
                    description: 'Испратена е-пошта за добредојде',
                    performed_by: 'Stefan Milosevski',
                    created_at: new Date(Date.now() - 3600000).toISOString()
                },
                {
                    id: 3,
                    lead_id: 2,
                    activity_type: 'status_changed',
                    description: 'Статус променет од contacted во qualified',
                    performed_by: 'Ana Stojanovic',
                    created_at: new Date(Date.now() - 43200000).toISOString()
                },
                {
                    id: 4,
                    lead_id: 3,
                    activity_type: 'viewing_requested',
                    description: 'Клиентот побара гледање на стан',
                    performed_by: 'Jana Mladenovska',
                    created_at: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: 5,
                    lead_id: 5,
                    activity_type: 'deal_closed',
                    description: 'Договор успешно завршен',
                    performed_by: 'Stefan Milosevski',
                    created_at: new Date(Date.now() - 86400000).toISOString()
                }
            ];

            // Load demo CRM users
            this.crmUsers = [
                {
                    id: 1,
                    email: 'demo@izostone.mk',
                    full_name: 'Demo Agent',
                    role: 'admin',
                    is_active: true,
                    created_at: new Date().toISOString()
                }
            ];
            
            // Update dashboard
            this.updateDashboard();
            
            console.log('✅ Enhanced CRM data loaded - tasks, activities, apartments included');
            
        } catch (error) {
            console.error('❌ Error loading demo data:', error);
            // Don't show error popup for demo
        }
    }

    // Load all leads - DEMO VERSION
    async loadLeads() {
        console.log('📋 Demo leads already loaded in loadInitialData');
        return true;
    }

    // Load CRM users - DEMO VERSION
    async loadCRMUsers() {
        console.log('👥 Demo CRM users already loaded in loadInitialData');
        
        // Populate assignee filters
        this.populateAssigneeFilters();
        return true;
    }

    // Update dashboard statistics
    updateDashboard() {
        const newLeads = this.leads.filter(lead => lead.status === 'new').length;
        const activeLeads = this.leads.filter(lead => 
            !['closed_won', 'closed_lost'].includes(lead.status)
        ).length;
        const closedDeals = this.leads.filter(lead => lead.status === 'closed_won').length;
        const conversionRate = this.leads.length > 0 ? 
            Math.round((closedDeals / this.leads.length) * 100) : 0;

        document.getElementById('newLeadsCount').textContent = newLeads;
        document.getElementById('activeLeadsCount').textContent = activeLeads;
        document.getElementById('closedDealsCount').textContent = closedDeals;
        document.getElementById('conversionRate').textContent = `${conversionRate}%`;
        
        // Update navigation badges
        document.getElementById('newLeadsBadge').textContent = newLeads;
        
        // Update recent leads
        this.updateRecentLeads();
        
        // Update follow-up reminders
        this.updateFollowUpReminders();
    }

    // Update recent leads list
    updateRecentLeads() {
        const recentLeads = this.leads.slice(0, 5);
        const container = document.getElementById('recentLeadsList');
        
        if (recentLeads.length === 0) {
            container.innerHTML = '<p style="color: #9ca3af; text-align: center;">No recent leads</p>';
            return;
        }
        
        container.innerHTML = recentLeads.map(lead => `
            <div class="recent-lead-item" onclick="showLeadDetail('${lead.id}')">
                <div class="lead-info">
                    <strong>${lead.name}</strong>
                    <span class="lead-email">${lead.email}</span>
                    ${lead.apartment_id ? `<span class="apartment-tag">Apt: ${lead.apartment_id}</span>` : ''}
                </div>
                <div class="lead-status">
                    <span class="status-badge ${lead.status}">${lead.status.replace('_', ' ')}</span>
                    <span class="lead-time">${this.formatTimeAgo(lead.created_at)}</span>
                </div>
            </div>
        `).join('');
    }

    // Update follow-up reminders
    updateFollowUpReminders() {
        const followUps = this.leads.filter(lead => 
            lead.follow_up_date && new Date(lead.follow_up_date) <= new Date()
        );
        
        const container = document.getElementById('followUpList');
        
        if (followUps.length === 0) {
            container.innerHTML = '<p style="color: #9ca3af; text-align: center;">No pending follow-ups</p>';
            return;
        }
        
        container.innerHTML = followUps.map(lead => `
            <div class="follow-up-item" onclick="showLeadDetail('${lead.id}')">
                <div class="follow-up-info">
                    <strong>${lead.name}</strong>
                    <span class="follow-up-date">Due: ${this.formatDate(lead.follow_up_date)}</span>
                </div>
                <span class="priority-badge ${lead.priority}">${lead.priority}</span>
            </div>
        `).join('');
    }

    // Show specific view
    showView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.view-content').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`${viewName}View`).classList.add('active');
        
        this.currentView = viewName;
        
        // Load view-specific data
        if (viewName === 'leads') {
            this.updateLeadsTable();
        }
    }

    // Update leads table
    updateLeadsTable() {
        const tbody = document.getElementById('leadsTableBody');
        
        if (this.leads.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; color: #9ca3af; padding: 2rem;">
                        No leads found
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = this.leads.map(lead => `
            <tr onclick="showLeadDetail('${lead.id}')" style="cursor: pointer;">
                <td>
                    <div class="lead-name">${lead.name}</div>
                    <div class="lead-email">${lead.email}</div>
                </td>
                <td>
                    ${lead.phone ? `<div>${lead.phone}</div>` : ''}
                    <div class="lead-email">${lead.email}</div>
                </td>
                <td>
                    ${lead.apartment_id ? `<span class="apartment-tag">${lead.apartment_id}</span>` : '-'}
                </td>
                <td>
                    <span class="status-badge ${lead.status}">${lead.status.replace('_', ' ')}</span>
                </td>
                <td>
                    <span class="priority-badge ${lead.priority}">${lead.priority}</span>
                </td>
                <td>
                    ${lead.assigned_user ? lead.assigned_user.full_name : 'Unassigned'}
                </td>
                <td>
                    ${this.formatDate(lead.created_at)}
                </td>
                <td>
                    <button class="action-btn" onclick="event.stopPropagation(); showLeadDetail('${lead.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="event.stopPropagation(); editLead('${lead.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Show lead detail modal
    async showLeadDetail(leadId) {
        const lead = this.leads.find(l => l.id === leadId);
        if (!lead) return;
        
        this.currentLead = lead;
        
        // Update modal title
        document.getElementById('leadDetailTitle').textContent = `Lead: ${lead.name}`;
        
        // Update contact info
        document.getElementById('leadContactInfo').innerHTML = `
            <div class="contact-info-grid">
                <div class="info-item">
                    <label>Name:</label>
                    <span>${lead.name}</span>
                </div>
                <div class="info-item">
                    <label>Email:</label>
                    <span>${lead.email}</span>
                </div>
                <div class="info-item">
                    <label>Phone:</label>
                    <span>${lead.phone || 'Not provided'}</span>
                </div>
                <div class="info-item">
                    <label>Apartment:</label>
                    <span>${lead.apartment_id || 'Not specified'}</span>
                </div>
                <div class="info-item full-width">
                    <label>Message:</label>
                    <div class="message-content">${lead.message}</div>
                </div>
            </div>
        `;
        
        // Update management controls
        document.getElementById('leadStatus').value = lead.status;
        document.getElementById('leadPriority').value = lead.priority;
        document.getElementById('leadAssignee').value = lead.assigned_to || '';
        
        if (lead.follow_up_date) {
            const date = new Date(lead.follow_up_date);
            document.getElementById('followUpDate').value = date.toISOString().slice(0, 16);
        }
        
        // Load notes and activities
        await this.loadNotesAndActivities(leadId);
        
        // Show modal
        document.getElementById('leadDetailModal').classList.add('show');
    }

    // Load notes and activities for a lead
    async loadNotesAndActivities(leadId) {
        try {
            // Load notes
            const { data: notes, error: notesError } = await this.supabase
                .from('lead_notes')
                .select(`
                    *,
                    user:user_id(full_name)
                `)
                .eq('lead_id', leadId)
                .order('created_at', { ascending: false });

            // Load activities
            const { data: activities, error: activitiesError } = await this.supabase
                .from('lead_activities')
                .select(`
                    *,
                    user:user_id(full_name)
                `)
                .eq('lead_id', leadId)
                .order('created_at', { ascending: false });

            if (notesError) throw notesError;
            if (activitiesError) throw activitiesError;

            // Combine and sort by date
            const combined = [
                ...(notes || []).map(note => ({ ...note, type: 'note' })),
                ...(activities || []).map(activity => ({ ...activity, type: 'activity' }))
            ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            // Display in UI
            const container = document.getElementById('notesAndActivities');
            
            if (combined.length === 0) {
                container.innerHTML = '<p style="color: #9ca3af; text-align: center;">No notes or activities yet</p>';
                return;
            }
            
            container.innerHTML = combined.map(item => {
                if (item.type === 'note') {
                    return `
                        <div class="note-item">
                            <div class="note-header">
                                <span class="note-type">${item.note_type}</span>
                                <span class="note-meta">${item.user?.full_name || 'System'} • ${this.formatDate(item.created_at)}</span>
                            </div>
                            <div class="note-content">${item.note_text}</div>
                        </div>
                    `;
                } else {
                    return `
                        <div class="activity-item">
                            <div class="activity-header">
                                <span class="activity-type">${item.activity_type.replace('_', ' ')}</span>
                                <span class="activity-meta">${item.user?.full_name || 'System'} • ${this.formatDate(item.created_at)}</span>
                            </div>
                            <div class="activity-content">${item.description}</div>
                        </div>
                    `;
                }
            }).join('');
            
        } catch (error) {
            console.error('❌ Error loading notes and activities:', error);
        }
    }

    // Add note to lead
    async addNote() {
        const noteText = document.getElementById('newNoteText').value.trim();
        const noteType = document.getElementById('noteType').value;
        
        if (!noteText || !this.currentLead) return;
        
        try {
            const { error } = await this.supabase
                .from('lead_notes')
                .insert([{
                    lead_id: this.currentLead.id,
                    user_id: this.currentUser.id,
                    note_text: noteText,
                    note_type: noteType
                }]);

            if (error) throw error;
            
            // Clear form
            document.getElementById('newNoteText').value = '';
            document.getElementById('noteType').value = 'general';
            
            // Reload notes and activities
            await this.loadNotesAndActivities(this.currentLead.id);
            
        } catch (error) {
            console.error('❌ Error adding note:', error);
            this.showError('Failed to add note');
        }
    }

    // Update lead field
    async updateLeadField(field, value) {
        if (!this.currentLead) return;
        
        try {
            const updateData = { [field]: value };
            
            const { error } = await this.supabase
                .from('leads')
                .update(updateData)
                .eq('id', this.currentLead.id);

            if (error) throw error;
            
            // Update local data
            this.currentLead[field] = value;
            const leadIndex = this.leads.findIndex(l => l.id === this.currentLead.id);
            if (leadIndex !== -1) {
                this.leads[leadIndex][field] = value;
            }
            
            // Refresh displays
            this.updateDashboard();
            if (this.currentView === 'leads') {
                this.updateLeadsTable();
            }
            
            console.log(`✅ Updated lead ${field}: ${value}`);
            
        } catch (error) {
            console.error(`❌ Error updating lead ${field}:`, error);
            this.showError(`Failed to update ${field}`);
        }
    }

    // Populate assignee filters
    populateAssigneeFilters() {
        const assigneeFilter = document.getElementById('assigneeFilter');
        const createLeadAssignee = document.getElementById('createLeadAssignee');
        const leadAssignee = document.getElementById('leadAssignee');
        
        const userOptions = this.crmUsers.map(user => 
            `<option value="${user.id}">${user.full_name}</option>`
        ).join('');
        
        if (assigneeFilter) {
            assigneeFilter.innerHTML = '<option value="">All Assignees</option>' + userOptions;
        }
        
        if (createLeadAssignee) {
            createLeadAssignee.innerHTML = '<option value="">Auto-assign</option>' + userOptions;
        }
        
        if (leadAssignee) {
            leadAssignee.innerHTML = '<option value="">Unassigned</option>' + userOptions;
        }
    }

    // Filter leads
    filterLeads() {
        const statusFilter = document.getElementById('statusFilter').value;
        const assigneeFilter = document.getElementById('assigneeFilter').value;
        const priorityFilter = document.getElementById('priorityFilter').value;
        
        // Apply filters (simplified for now)
        this.updateLeadsTable();
    }

    // Utility functions
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatTimeAgo(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    }

    // Show loading overlay
    showLoading(message = 'Loading...') {
        const overlay = document.getElementById('loadingOverlay');
        const text = overlay.querySelector('p');
        if (text) text.textContent = message;
        overlay.style.display = 'flex';
    }

    // Hide loading overlay
    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    // Show error message - DISABLED FOR DEMO
    showError(message) {
        console.log('❌ Error suppressed for demo:', message);
        // No popup for demo version
    }

    // Logout
    async logout() {
        try {
            await this.supabase.auth.signOut();
        } catch (error) {
            console.error('❌ Logout error:', error);
        }
    }

    // =====================================================
    // ENHANCED CRM FEATURES - TASK MANAGEMENT
    // =====================================================
    
    // Load tasks for dashboard
    loadTasks() {
        const pendingTasks = this.tasks.filter(task => !task.completed);
        const overdueTasks = pendingTasks.filter(task => new Date(task.due_date) < new Date());
        
        console.log(`📋 Tasks: ${this.tasks.length} total, ${pendingTasks.length} pending, ${overdueTasks.length} overdue`);
    }
    
    // Complete a task
    async completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        task.completed = true;
        task.completed_at = new Date().toISOString();
        
        this.logActivity(task.lead_id, 'task_completed', `Task completed: ${task.title}`, this.currentUser.full_name);
        
        console.log('✅ Task completed:', task.title);
    }
    
    // =====================================================
    // ENHANCED CRM FEATURES - ACTIVITY LOGGING
    // =====================================================
    
    // Log activity for a lead
    logActivity(leadId, activityType, description, performedBy = null) {
        const newActivity = {
            id: this.activities.length + 1,
            lead_id: leadId,
            activity_type: activityType,
            description: description,
            performed_by: performedBy || this.currentUser.full_name,
            created_at: new Date().toISOString()
        };
        
        this.activities.push(newActivity);
        console.log(`📋 Activity logged: ${activityType} for lead ${leadId}`);
    }
    
    // =====================================================
    // ENHANCED CRM FEATURES - SALES PIPELINE
    // =====================================================
    
    // Calculate sales pipeline data
    calculateSalesPipeline() {
        const pipeline = {
            new: { count: 0, value: 0 },
            contacted: { count: 0, value: 0 },
            qualified: { count: 0, value: 0 },
            proposal: { count: 0, value: 0 },
            closed_won: { count: 0, value: 0 },
            closed_lost: { count: 0, value: 0 }
        };
        
        this.leads.forEach(lead => {
            const status = lead.status || 'new';
            if (pipeline[status]) {
                pipeline[status].count++;
                pipeline[status].value += lead.budget || 0;
            }
        });
        
        return pipeline;
    }
    
    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('mk-MK', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount || 0);
    }
    
    // Format date and time
    formatDateTime(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('mk-MK', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Global CRM app instance
let crmApp;

// Global functions for HTML onclick handlers
function showView(viewName) {
    crmApp.showView(viewName);
}

function showLeadDetail(leadId) {
    crmApp.showLeadDetail(leadId);
}

function closeLeadDetailModal() {
    document.getElementById('leadDetailModal').classList.remove('show');
}

function updateLeadField(field, value) {
    crmApp.updateLeadField(field, value);
}

function addNote() {
    crmApp.addNote();
}

function filterLeads() {
    crmApp.filterLeads();
}

function refreshDashboard() {
    crmApp.loadInitialData();
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

function logout() {
    crmApp.logout();
}

function showNotifications() {
    alert('Notifications feature coming soon!');
}

function showProfile() {
    alert('Profile management coming soon!');
}

function showSettings() {
    crmApp.showView('settings');
}

function exportLeads() {
    alert('Export feature coming soon!');
}

function showCreateLeadModal() {
    alert('Create lead modal coming soon!');
}

function closeCreateLeadModal() {
    document.getElementById('createLeadModal').classList.remove('show');
}

function showCreateUserModal() {
    alert('Create user modal coming soon!');
}

// =====================================================
// ENHANCED CRM GLOBAL FUNCTIONS
// =====================================================

function completeTask(taskId) {
    if (window.crmApp) {
        window.crmApp.completeTask(taskId);
    }
}

function showTaskDetail(taskId) {
    const task = window.crmApp?.tasks.find(t => t.id === taskId);
    if (task) {
        console.log('📋 Show task detail:', task);
    }
}

// Initialize CRM when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    crmApp = new CRMApp();
    await crmApp.initialize();
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) {
        document.getElementById('userDropdown').classList.remove('show');
    }
});