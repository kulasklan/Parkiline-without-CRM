// Enhanced CRM Application for ParkLine Residences - FIXED VERSION
class CRMApp {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.leads = [];
        this.tasks = [];
        this.activities = [];
        this.apartments = [];
        this.crmUsers = [];
        this.currentLead = null;
        this.currentView = 'dashboard';
        this.isInitialized = false;
        this.refreshInterval = null;
    }

    // Initialize the CRM application
    async initialize() {
        try {
            console.log('🚀 Initializing Enhanced CRM...');
            
            // Debug: Check DOM Elements
            console.log('DOM Elements Check:', {
                loadingOverlay: !!document.getElementById('loadingOverlay'),
                loginScreen: !!document.getElementById('loginScreen'),
                crmDashboard: !!document.getElementById('crmDashboard'), // ✅ Correct ID
                currentUserName: !!document.getElementById('currentUserName'), // ✅ Correct ID
                loginUsername: !!document.getElementById('loginUsername'), // ✅ Correct ID
                newLeadsCount: !!document.getElementById('newLeadsCount'),
                activeLeadsCount: !!document.getElementById('activeLeadsCount'),
                closedDealsCount: !!document.getElementById('closedDealsCount'),
                conversionRate: !!document.getElementById('conversionRate')
            });
            
            // Setup login form handler first
            this.setupLoginHandler();
            
            // Check for existing session
            const session = localStorage.getItem('crm_session');
            if (session && this.validateSession(session)) {
                console.log('✅ Valid session found, auto-login');
                this.currentUser = { 
                    id: 'demo_user', 
                    username: 'admin', 
                    full_name: 'Admin User',
                    role: 'admin'
                };
                this.showDashboard();
                this.initializeUI();
                await this.loadInitialData();
                this.setupAutoRefresh();
            } else {
                console.log('🔐 No valid session, showing login');
                this.showLogin();
            }
            
            this.isInitialized = true;
            console.log('✅ Enhanced CRM initialized successfully');
            
        } catch (error) {
            console.error('❌ CRM initialization failed:', error.message);
            this.showLogin();
            this.isInitialized = true;
        }
    }

    // Setup login form handler
    setupLoginHandler() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            // Remove any existing listeners
            loginForm.replaceWith(loginForm.cloneNode(true));
            const newLoginForm = document.getElementById('loginForm');
            if (newLoginForm) {
                newLoginForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await this.handleLogin();
                });
            }
        }
    }

    // Session validation
    validateSession(session) {
        try {
            const sessionData = JSON.parse(session);
            const now = new Date().getTime();
            const sessionAge = now - sessionData.timestamp;
            const maxAge = 24 * 60 * 60 * 1000; // 24 hours
            return sessionAge < maxAge;
        } catch (error) {
            return false;
        }
    }

    // Show login screen
    showLogin() {
        const loginScreen = document.getElementById('loginScreen');
        const mainScreen = document.getElementById('crmDashboard'); // ✅ Fixed: using correct ID
        
        if (loginScreen) loginScreen.style.display = 'flex';
        if (mainScreen) mainScreen.style.display = 'none';
        this.hideLoading();
    }

    // Show dashboard
    showDashboard() {
        const loginScreen = document.getElementById('loginScreen');
        const mainScreen = document.getElementById('crmDashboard'); // ✅ Fixed: using correct ID
        
        if (loginScreen) loginScreen.style.display = 'none';
        if (mainScreen) mainScreen.style.display = 'block';
        this.hideLoading();
    }

    // Initialize UI elements
    initializeUI() {
        if (this.currentUser) {
            // ✅ Fixed: Using the correct element ID from HTML
            const currentUserNameEl = document.getElementById('currentUserName');
            if (currentUserNameEl) {
                currentUserNameEl.textContent = this.currentUser.full_name;
            }
        }
    }

    // Hide loading overlay
    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    // Show login messages
    showLoginMessage(message, type = 'error') {
        const messageEl = document.getElementById('loginMessage');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = `login-message ${type}`;
            messageEl.style.display = 'block';

            setTimeout(() => {
                if (type !== 'success') {
                    messageEl.style.display = 'none';
                }
            }, 4000);
        }
    }

    // Handle login
    async handleLogin() {
        // ✅ Fixed: using correct form field IDs that exist in HTML
        const usernameEl = document.getElementById('loginUsername');
        const passwordEl = document.getElementById('loginPassword');
        
        if (!usernameEl || !passwordEl) {
            console.error('❌ Login form elements not found');
            return;
        }
        
        const username = usernameEl.value;
        const password = passwordEl.value;
        
        try {
            this.showLoginMessage('Logging in...', 'info');
            
            // Demo login check
            if (username === 'admin' && password === 'admin123') {
                this.currentUser = {
                    id: 'demo_user',
                    email: 'admin@izostone.mk',
                    full_name: 'Admin User',
                    role: 'admin'
                };
                
                // Save session
                const sessionData = {
                    user: this.currentUser,
                    timestamp: new Date().getTime()
                };
                localStorage.setItem('crm_session', JSON.stringify(sessionData));
                
                this.showLoginMessage('Login successful!', 'success');
                
                setTimeout(() => {
                    this.showDashboard();
                    this.initializeUI();
                    this.loadInitialData();
                    this.setupAutoRefresh();
                }, 1000);
                
                return;
            }

            // Invalid credentials
            this.showLoginMessage('Invalid username or password', 'error');
            
        } catch (error) {
            console.error('❌ Login process error:', error);
            this.showLoginMessage('Login failed. Please try again.', 'error');
        }
    }

    // Logout function
    logout() {
        this.currentUser = null;
        localStorage.removeItem('crm_session');
        
        // Clear auto-refresh
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
        
        this.showLogin();
        console.log('🚪 User logged out');
    }

    // Setup auto-refresh
    setupAutoRefresh() {
        // Clear existing interval first
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
        
        // Only set up if we're properly initialized and logged in
        if (!this.isInitialized || !this.currentUser) {
            console.log('⏸️ Skipping auto-refresh setup - not logged in');
            return;
        }
        
        // Set up new interval for auto-refresh every 5 minutes
        this.refreshInterval = setInterval(async () => {
            if (this.isInitialized && this.currentUser) {
                console.log('🔄 Auto-refreshing leads...');
                await this.refreshLeads();
            }
        }, 300000); // 5 minutes
        
        console.log('⚡ Auto-refresh enabled (5min intervals)');
    }

    // Refresh leads data
    async refreshLeads() {
        try {
            console.log('🔄 Refreshing leads data...');
            
            // Reload data from database
            await this.loadInitialData();
            
            // Update current view if showing leads
            if (this.currentView === 'leads') {
                this.updateLeadsTable();
            }
            
        } catch (error) {
            console.error('❌ Error refreshing leads:', error);
        }
    }

    // Load initial data
    async loadInitialData() {
        try {
            console.log('📊 Loading enhanced CRM data...');
            
            // Initialize Supabase client if not already done
            if (!this.supabase && window.CONFIG?.SUPABASE_URL) {
                const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
                this.supabase = createClient(
                    window.CONFIG.SUPABASE_URL, 
                    window.CONFIG.SUPABASE_ANON_KEY
                );
            }
            
            // Try to load real leads from database
            if (this.supabase) {
                console.log('📊 Loading real leads from database...');
                const { data: realLeads, error } = await this.supabase
                    .from('leads')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (error) {
                    console.warn('⚠️ Could not load leads from database:', error.message);
                    console.log('📊 Using demo data instead');
                    this.loadDemoData();
                } else {
                    console.log(`✅ Loaded ${realLeads.length} real leads from database`);
                    // Process real leads data to match our format
                    this.leads = realLeads.map(lead => ({
                        id: lead.id,
                        name: lead.name,
                        email: lead.email,
                        phone: lead.phone || 'N/A',
                        apartment_id: lead.apartment_id || 'Not specified',
                        message: lead.message,
                        status: 'new', // Default status for new leads
                        priority: 'medium', // Default priority
                        budget: 0, // Not collected in form
                        source: 'Website',
                        assigned_to: 'Unassigned',
                        created_at: lead.created_at
                    }));
                    
                    // If no real leads, show demo data
                    if (this.leads.length === 0) {
                        console.log('📊 No real leads found, showing demo data');
                        this.loadDemoData();
                    }
                }
            } else {
                console.log('📊 No database connection, using demo data');
                this.loadDemoData();
            }

            // Load demo tasks and activities (can be real data later)
            this.loadDemoTasksAndActivities();

            // Update dashboard
            this.updateDashboard();
            
            console.log('✅ Enhanced CRM data loaded');
            
        } catch (error) {
            console.error('❌ Error loading CRM data:', error);
            // Fallback to demo data
            console.log('📊 Loading demo data as fallback');
            this.loadDemoData();
            this.updateDashboard();
        }
    }

    // Load demo data as fallback
    loadDemoData() {
        this.leads = [
            {
                id: 1,
                name: 'Marina Petrovic',
                email: 'marina.p@email.com',
                phone: '+389 70 123 456',
                apartment_id: 'А-1204',
                message: 'Заинтересирана сум за двособен стан на повисок кат.',
                status: 'new',
                priority: 'high',
                budget: 2500.00,
                source: 'Website',
                assigned_to: 'Stefan Milosevski',
                created_at: new Date(Date.now() - 2*60*60*1000).toISOString()
            },
            {
                id: 2,
                name: 'Aleksandar Kostovski',
                email: 'aleksandar.k@email.com',
                phone: '+389 71 987 654',
                apartment_id: 'Б-2401',
                message: 'Би сакал да го видам пентхаусот.',
                status: 'contacted',
                priority: 'high',
                budget: 4200.00,
                source: 'Facebook',
                assigned_to: 'Ana Stojanovic',
                created_at: new Date(Date.now() - 1*24*60*60*1000).toISOString()
            }
        ];
        this.loadDemoTasksAndActivities();
    }

    // Load demo tasks and activities
    loadDemoTasksAndActivities() {
        this.tasks = [
            {
                id: 1,
                title: 'Follow up with Marina P.',
                description: 'Schedule apartment viewing and discuss financing options',
                lead_id: 1,
                assigned_to: 'Stefan Milosevski',
                due_date: new Date(Date.now() + 2*60*60*1000).toISOString(),
                priority: 'high',
                completed: false,
                task_type: 'follow_up',
                created_at: new Date().toISOString()
            }
        ];

        this.activities = [
            {
                id: 1,
                lead_id: 1,
                activity_type: 'lead_created',
                description: 'New lead registered from website',
                performed_by: 'System',
                created_at: new Date(Date.now() - 2*60*60*1000).toISOString()
            }
        ];
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

        // ✅ Fixed: Using safe element access with null checks
        const newLeadsCountEl = document.getElementById('newLeadsCount');
        const activeLeadsCountEl = document.getElementById('activeLeadsCount');
        const closedDealsCountEl = document.getElementById('closedDealsCount');
        const conversionRateEl = document.getElementById('conversionRate');
        const newLeadsBadgeEl = document.getElementById('newLeadsBadge');

        if (newLeadsCountEl) newLeadsCountEl.textContent = newLeads;
        if (activeLeadsCountEl) activeLeadsCountEl.textContent = activeLeads;
        if (closedDealsCountEl) closedDealsCountEl.textContent = closedDeals;
        if (conversionRateEl) conversionRateEl.textContent = conversionRate + '%';
        if (newLeadsBadgeEl) newLeadsBadgeEl.textContent = newLeads;
    }

    // Show view
    showView(viewName) {
        this.currentView = viewName;
        
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const navItem = document.querySelector(`[onclick="showView('${viewName}')"]`);
        if (navItem) navItem.classList.add('active');
        
        // Update content
        document.querySelectorAll('.view-content').forEach(view => {
            view.classList.remove('active');
        });
        
        const viewElement = document.getElementById(viewName + 'View');
        if (viewElement) {
            viewElement.classList.add('active');
        }
        
        if (viewName === 'leads') {
            this.updateLeadsTable();
        }
    }

    // Update leads table
    updateLeadsTable() {
        const tbody = document.getElementById('leadsTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        this.leads.forEach(lead => {
            const row = document.createElement('tr');
            row.className = 'lead-row';
            row.onclick = () => this.showLeadDetails(lead.id);
            
            const statusClass = this.getStatusClass(lead.status);
            const priorityClass = this.getPriorityClass(lead.priority);
            
            row.innerHTML = `
                <td class="lead-name">
                    <div class="lead-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="lead-info">
                        <div class="name">${lead.name}</div>
                        <div class="contact">${lead.email}</div>
                    </div>
                </td>
                <td><span class="apartment-id">${lead.apartment_id}</span></td>
                <td><span class="status-badge ${statusClass}">${this.formatStatus(lead.status)}</span></td>
                <td><span class="priority-badge ${priorityClass}">${lead.priority.toUpperCase()}</span></td>
                <td class="assigned-to">${lead.assigned_to}</td>
                <td class="created-date">${new Date(lead.created_at).toLocaleDateString()}</td>
                <td class="actions">
                    <button class="action-btn" onclick="event.stopPropagation(); showLeadDetails(${lead.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="event.stopPropagation(); editLead(${lead.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    // Helper functions
    getStatusClass(status) {
        const statusClasses = {
            'new': 'status-new',
            'contacted': 'status-contacted',
            'qualified': 'status-qualified',
            'proposal': 'status-proposal',
            'negotiation': 'status-negotiation',
            'closed_won': 'status-won',
            'closed_lost': 'status-lost'
        };
        return statusClasses[status] || 'status-default';
    }

    getPriorityClass(priority) {
        const priorityClasses = {
            'high': 'priority-high',
            'medium': 'priority-medium',
            'low': 'priority-low'
        };
        return priorityClasses[priority] || 'priority-default';
    }

    formatStatus(status) {
        const statusNames = {
            'new': 'New',
            'contacted': 'Contacted',
            'qualified': 'Qualified',
            'proposal': 'Proposal',
            'negotiation': 'Negotiation',
            'closed_won': 'Closed Won',
            'closed_lost': 'Closed Lost'
        };
        return statusNames[status] || status;
    }

    // Show lead details
    showLeadDetails(leadId) {
        const lead = this.leads.find(l => l.id === leadId);
        if (!lead) return;
        
        console.log('📋 Showing details for lead:', lead.name);
        // Implementation for showing lead details modal would go here
    }
}

// Global CRM app instance
let crmApp = null;

// Initialize CRM when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    crmApp = new CRMApp();
    await crmApp.initialize();
});

// Global functions for UI interaction
function showView(viewName) {
    if (crmApp && crmApp.isInitialized) {
        crmApp.showView(viewName);
    }
}

function refreshDashboard() {
    if (crmApp && crmApp.isInitialized) {
        console.log('🔄 Manual refresh triggered');
        crmApp.refreshLeads();
    }
}

function showLeadDetails(leadId) {
    if (crmApp && crmApp.isInitialized) {
        crmApp.showLeadDetails(leadId);
    }
}

function editLead(leadId) {
    console.log('✏️ Edit lead:', leadId);
    // Implementation would go here
}

function handleGlobalSearch(query) {
    if (crmApp && crmApp.isInitialized) {
        console.log('🔍 Global search:', query);
        // Implementation would go here
    }
}

function toggleUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.classList.toggle('active');
    }
}

function showNotifications() {
    console.log('🔔 Show notifications');
    // Implementation would go here
}

function logoutUser() {
    if (crmApp) {
        crmApp.logout();
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) {
        document.querySelector('.user-menu')?.classList.remove('active');
    }
});

console.log('✅ Enhanced CRM Module Loaded');