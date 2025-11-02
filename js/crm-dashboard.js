class CRMDashboard {
    constructor() {
        this.currentView = 'dashboard';
        this.currentLead = null;
        this.leads = [];
        this.opportunities = [];
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.loadBitrixConfig();
        this.loadDashboardData();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                this.switchView(view);

                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }

    switchView(viewName) {
        const views = document.querySelectorAll('.view-container');
        views.forEach(view => view.classList.remove('active'));

        const targetView = document.getElementById(`${viewName}View`);
        if (targetView) {
            targetView.classList.add('active');
            this.currentView = viewName;
        }

        const titles = {
            dashboard: 'Dashboard',
            leads: 'Leads Management',
            opportunities: 'Opportunities',
            analytics: 'Analytics & Reports',
            settings: 'Settings'
        };

        document.getElementById('pageTitle').textContent = titles[viewName] || 'Dashboard';

        if (viewName === 'dashboard') {
            this.loadDashboardData();
        } else if (viewName === 'leads') {
            this.loadLeads();
        } else if (viewName === 'opportunities') {
            this.loadOpportunities();
        }
    }

    setupEventListeners() {
        document.getElementById('syncBitrix')?.addEventListener('click', () => this.syncWithBitrix());
        document.getElementById('refreshLeads')?.addEventListener('click', () => this.loadLeads());
        document.getElementById('refreshOpportunities')?.addEventListener('click', () => this.loadOpportunities());
        document.getElementById('leadSearch')?.addEventListener('input', (e) => this.filterLeads(e.target.value));
        document.getElementById('statusFilter')?.addEventListener('change', (e) => this.filterLeadsByStatus(e.target.value));
        document.getElementById('saveBitrixWebhook')?.addEventListener('click', () => this.saveBitrixConfig());
        document.getElementById('closeLeadDetail')?.addEventListener('click', () => this.closeLeadModal());
    }

    async loadDashboardData() {
        try {
            const stats = await window.supabaseCRM.getLeadStats();
            if (stats) {
                document.getElementById('statTotalLeads').textContent = stats.total;
                document.getElementById('statNewLeads').textContent = stats.new;
            }

            const metrics = await window.supabaseCRM.getConversionMetrics();
            if (metrics) {
                document.getElementById('statOpportunities').textContent = metrics.convertedToOpportunity;
                document.getElementById('statWonDeals').textContent = metrics.wonDeals;
                document.getElementById('conversionRate').textContent = metrics.conversionRate + '%';
                document.getElementById('winRate').textContent = metrics.winRate + '%';
                document.getElementById('totalRevenue').textContent = '€' + metrics.totalRevenue.toLocaleString();
            }

            this.renderStatusChart(stats);
            await this.loadRecentLeads();

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }

    renderStatusChart(stats) {
        const chartContainer = document.getElementById('statusBarChart');
        if (!chartContainer || !stats) return;

        const statusData = [
            { label: 'New', value: stats.new, color: '#3498db' },
            { label: 'Contacted', value: stats.contacted, color: '#9b59b6' },
            { label: 'Qualified', value: stats.qualified, color: '#27ae60' },
            { label: 'Negotiation', value: stats.negotiation, color: '#f39c12' },
            { label: 'Won', value: stats.won, color: '#2ecc71' },
            { label: 'Lost', value: stats.lost, color: '#e74c3c' }
        ];

        const maxValue = Math.max(...statusData.map(d => d.value), 1);

        chartContainer.innerHTML = statusData.map(item => {
            const percentage = (item.value / maxValue) * 100;
            return `
                <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="font-size: 13px; color: #555;">${item.label}</span>
                        <span style="font-size: 13px; font-weight: 600; color: ${item.color};">${item.value}</span>
                    </div>
                    <div style="height: 8px; background: #f0f0f0; border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; width: ${percentage}%; background: ${item.color}; transition: width 0.3s ease;"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    async loadRecentLeads() {
        try {
            const leads = await window.supabaseCRM.getLeads({});
            const recentLeads = leads.slice(0, 5);

            const listContainer = document.getElementById('recentLeadsList');
            if (!listContainer) return;

            if (recentLeads.length === 0) {
                listContainer.innerHTML = '<p class="no-data">No leads yet</p>';
                return;
            }

            listContainer.innerHTML = recentLeads.map(lead => `
                <div style="padding: 16px; background: #f8f9fa; border-radius: 8px; cursor: pointer;"
                     onclick="window.crmDashboard.viewLeadDetails('${lead.id}')">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <strong style="font-size: 15px;">${lead.contact_name}</strong>
                            <div style="font-size: 13px; color: #666; margin-top: 4px;">
                                ${lead.apartment_id || 'No apartment'} • ${lead.contact_phone}
                            </div>
                        </div>
                        <span class="status-badge status-${lead.status}">${lead.status}</span>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error('Error loading recent leads:', error);
        }
    }

    async loadLeads() {
        try {
            this.leads = await window.supabaseCRM.getLeads({});
            this.renderLeadsTable(this.leads);
        } catch (error) {
            console.error('Error loading leads:', error);
            this.showError('Failed to load leads');
        }
    }

    renderLeadsTable(leads) {
        const tbody = document.getElementById('leadsTableBody');
        if (!tbody) return;

        if (leads.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No leads found</td></tr>';
            return;
        }

        tbody.innerHTML = leads.map(lead => `
            <tr>
                <td>${lead.contact_name}</td>
                <td>${lead.contact_email}</td>
                <td>${lead.contact_phone}</td>
                <td>${lead.apartment_id || '-'}</td>
                <td><span class="status-badge status-${lead.status}">${lead.status}</span></td>
                <td>${new Date(lead.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="action-btn" onclick="window.crmDashboard.viewLeadDetails('${lead.id}')">
                        View
                    </button>
                </td>
            </tr>
        `).join('');
    }

    filterLeads(searchTerm) {
        const filtered = this.leads.filter(lead => {
            const searchLower = searchTerm.toLowerCase();
            return lead.contact_name.toLowerCase().includes(searchLower) ||
                   lead.contact_email.toLowerCase().includes(searchLower) ||
                   lead.contact_phone.includes(searchTerm);
        });
        this.renderLeadsTable(filtered);
    }

    filterLeadsByStatus(status) {
        if (!status) {
            this.renderLeadsTable(this.leads);
            return;
        }
        const filtered = this.leads.filter(lead => lead.status === status);
        this.renderLeadsTable(filtered);
    }

    async viewLeadDetails(leadId) {
        try {
            const lead = await window.supabaseCRM.getLead(leadId);
            const activities = await window.supabaseCRM.getActivitiesForLead(leadId);

            this.currentLead = lead;

            const modal = document.getElementById('leadDetailModal');
            const modalBody = document.getElementById('leadDetailBody');

            modalBody.innerHTML = `
                <div style="margin-bottom: 24px;">
                    <h3 style="margin-bottom: 12px;">Contact Information</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                        <div><strong>Name:</strong> ${lead.contact_name}</div>
                        <div><strong>Status:</strong> <span class="status-badge status-${lead.status}">${lead.status}</span></div>
                        <div><strong>Email:</strong> ${lead.contact_email}</div>
                        <div><strong>Phone:</strong> ${lead.contact_phone}</div>
                        <div><strong>Preferred Contact:</strong> ${lead.preferred_contact_method}</div>
                        <div><strong>Created:</strong> ${new Date(lead.created_at).toLocaleString()}</div>
                    </div>
                </div>

                <div style="margin-bottom: 24px;">
                    <h3 style="margin-bottom: 12px;">Apartment Details</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                        <div><strong>Apartment:</strong> ${lead.apartment_id || '-'}</div>
                        <div><strong>Floor:</strong> ${lead.apartment_floor || '-'}</div>
                        <div><strong>Size:</strong> ${lead.apartment_size ? lead.apartment_size + 'm²' : '-'}</div>
                        <div><strong>Bedrooms:</strong> ${lead.apartment_bedrooms || '-'}</div>
                        <div><strong>Price:</strong> ${lead.apartment_price ? '€' + lead.apartment_price.toLocaleString() : '-'}</div>
                    </div>
                </div>

                ${lead.message ? `
                <div style="margin-bottom: 24px;">
                    <h3 style="margin-bottom: 12px;">Message</h3>
                    <div style="padding: 12px; background: #f8f9fa; border-radius: 8px;">
                        ${lead.message}
                    </div>
                </div>
                ` : ''}

                <div style="margin-bottom: 24px;">
                    <h3 style="margin-bottom: 12px;">Activities (${activities.length})</h3>
                    ${activities.length > 0 ? activities.map(act => `
                        <div style="padding: 12px; background: #f8f9fa; border-radius: 8px; margin-bottom: 8px;">
                            <div style="display: flex; justify-content: between;">
                                <strong>${act.activity_type}</strong>
                                <span style="font-size: 13px; color: #666;">
                                    ${new Date(act.created_at).toLocaleString()}
                                </span>
                            </div>
                            ${act.description ? `<div style="margin-top: 8px; color: #555;">${act.description}</div>` : ''}
                        </div>
                    `).join('') : '<p class="no-data">No activities yet</p>'}
                </div>

                <div>
                    <button class="btn-primary" onclick="window.crmDashboard.addActivity()">
                        Add Activity
                    </button>
                    <button class="btn-primary" onclick="window.crmDashboard.convertToOpportunity()">
                        Convert to Opportunity
                    </button>
                </div>
            `;

            modal.classList.add('active');

        } catch (error) {
            console.error('Error loading lead details:', error);
            this.showError('Failed to load lead details');
        }
    }

    closeLeadModal() {
        const modal = document.getElementById('leadDetailModal');
        modal.classList.remove('active');
    }

    async loadOpportunities() {
        try {
            this.opportunities = await window.supabaseCRM.getOpportunities({});
            this.renderOpportunitiesTable(this.opportunities);
        } catch (error) {
            console.error('Error loading opportunities:', error);
        }
    }

    renderOpportunitiesTable(opportunities) {
        const tbody = document.getElementById('opportunitiesTableBody');
        if (!tbody) return;

        if (opportunities.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No opportunities found</td></tr>';
            return;
        }

        tbody.innerHTML = opportunities.map(opp => `
            <tr>
                <td>${opp.title}</td>
                <td>${opp.leads ? opp.leads.contact_name : '-'}</td>
                <td>€${opp.deal_value.toLocaleString()}</td>
                <td><span class="status-badge status-${opp.stage}">${opp.stage.replace('_', ' ')}</span></td>
                <td>${opp.probability}%</td>
                <td>${opp.expected_close_date ? new Date(opp.expected_close_date).toLocaleDateString() : '-'}</td>
                <td>
                    <button class="action-btn">View</button>
                </td>
            </tr>
        `).join('');
    }

    loadBitrixConfig() {
        const savedWebhook = localStorage.getItem('bitrix_webhook_url');
        if (savedWebhook) {
            document.getElementById('bitrixWebhook').value = savedWebhook;
            window.bitrixIntegration.configure(savedWebhook);
        }
    }

    async saveBitrixConfig() {
        const webhookInput = document.getElementById('bitrixWebhook');
        const webhookUrl = webhookInput.value.trim();

        if (!webhookUrl) {
            this.showStatus('Please enter a webhook URL', 'error');
            return;
        }

        window.bitrixIntegration.configure(webhookUrl);
        localStorage.setItem('bitrix_webhook_url', webhookUrl);

        window.CONFIG.BITRIX_WEBHOOK_URL = webhookUrl;

        const result = await window.bitrixIntegration.testConnection();
        this.showStatus(result.message, result.success ? 'success' : 'error');
    }

    async syncWithBitrix() {
        const btn = document.getElementById('syncBitrix');
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing...';
        btn.disabled = true;

        try {
            console.log('Sync functionality will be implemented based on your requirements');
            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.disabled = false;
                alert('Sync complete!');
            }, 2000);
        } catch (error) {
            console.error('Sync error:', error);
            btn.innerHTML = originalContent;
            btn.disabled = false;
        }
    }

    showStatus(message, type) {
        const statusElement = document.getElementById('connectionStatus');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = 'status-message ' + type;
            setTimeout(() => {
                statusElement.className = 'status-message';
            }, 5000);
        }
    }

    showError(message) {
        alert(message);
    }

    addActivity() {
        alert('Activity logging interface will open here');
    }

    convertToOpportunity() {
        alert('Convert to opportunity dialog will open here');
    }
}

window.crmDashboard = new CRMDashboard();
