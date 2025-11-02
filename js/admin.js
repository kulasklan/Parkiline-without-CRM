class AdminPanel {
    constructor() {
        this.init();
    }

    init() {
        this.loadBitrixConfig();
        this.attachEventListeners();
        this.loadStatistics();
        this.loadRecentActivity();
        this.checkConnectionStatus();
    }

    attachEventListeners() {
        document.getElementById('btnTestConnection')?.addEventListener('click', () => this.testConnection());
        document.getElementById('btnSaveConfig')?.addEventListener('click', () => this.saveConfiguration());
        document.getElementById('btnRefreshStats')?.addEventListener('click', () => this.loadStatistics());
    }

    loadBitrixConfig() {
        const savedWebhook = localStorage.getItem('bitrix_webhook_url');
        if (savedWebhook) {
            document.getElementById('bitrixWebhook').value = savedWebhook;
            if (window.bitrixIntegration) {
                window.bitrixIntegration.configure(savedWebhook);
            }
        }
    }

    async checkConnectionStatus() {
        const statusIndicator = document.getElementById('statusIndicator');
        const statusText = document.getElementById('statusText');

        if (!window.bitrixIntegration?.isConfigured) {
            statusIndicator.className = 'status-indicator status-unknown';
            statusText.textContent = 'Not configured';
            return;
        }

        try {
            const result = await window.bitrixIntegration.testConnection();
            if (result.success) {
                statusIndicator.className = 'status-indicator status-connected';
                statusText.textContent = 'Connected';
            } else {
                statusIndicator.className = 'status-indicator status-disconnected';
                statusText.textContent = 'Connection failed';
            }
        } catch (error) {
            statusIndicator.className = 'status-indicator status-disconnected';
            statusText.textContent = 'Connection error';
        }
    }

    async testConnection() {
        const btn = document.getElementById('btnTestConnection');
        const originalHTML = btn.innerHTML;

        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner"></span> Testing...';

        const webhookInput = document.getElementById('bitrixWebhook');
        const webhookUrl = webhookInput.value.trim();

        if (!webhookUrl) {
            this.showMessage('Please enter a webhook URL', 'error');
            btn.disabled = false;
            btn.innerHTML = originalHTML;
            return;
        }

        if (window.bitrixIntegration) {
            window.bitrixIntegration.configure(webhookUrl);
        }

        try {
            const result = await window.bitrixIntegration.testConnection();
            this.showMessage(result.message, result.success ? 'success' : 'error');
            await this.checkConnectionStatus();
        } catch (error) {
            this.showMessage(`Connection error: ${error.message}`, 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        }
    }

    async saveConfiguration() {
        const btn = document.getElementById('btnSaveConfig');
        const originalHTML = btn.innerHTML;

        btn.disabled = true;
        btn.innerHTML = '<span class="loading-spinner"></span> Saving...';

        const webhookInput = document.getElementById('bitrixWebhook');
        const webhookUrl = webhookInput.value.trim();

        if (!webhookUrl) {
            this.showMessage('Please enter a webhook URL', 'error');
            btn.disabled = false;
            btn.innerHTML = originalHTML;
            return;
        }

        try {
            localStorage.setItem('bitrix_webhook_url', webhookUrl);

            if (window.bitrixIntegration) {
                window.bitrixIntegration.configure(webhookUrl);
            }

            if (window.CONFIG) {
                window.CONFIG.BITRIX_WEBHOOK_URL = webhookUrl;
            }

            const result = await window.bitrixIntegration.testConnection();

            if (result.success) {
                this.showMessage('Configuration saved and connection verified successfully!', 'success');
                await this.checkConnectionStatus();
            } else {
                this.showMessage('Configuration saved but connection test failed: ' + result.message, 'error');
            }
        } catch (error) {
            this.showMessage('Configuration saved but connection test failed: ' + error.message, 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalHTML;
        }
    }

    async loadStatistics() {
        const btn = document.getElementById('btnRefreshStats');
        if (btn) {
            btn.disabled = true;
            btn.querySelector('i').style.animation = 'spin 1s linear infinite';
        }

        try {
            if (!window.supabaseCRM) {
                throw new Error('Supabase client not initialized');
            }

            const stats = await window.supabaseCRM.getLeadStats();

            document.getElementById('statTotalLeads').textContent = stats.total || 0;

            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const leads = await window.supabaseCRM.getLeads({});

            const todayLeads = leads.filter(lead => new Date(lead.created_at) >= todayStart).length;
            document.getElementById('statTodayLeads').textContent = todayLeads;

            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - 7);
            const weekLeads = leads.filter(lead => new Date(lead.created_at) >= weekStart).length;
            document.getElementById('statWeekLeads').textContent = weekLeads;

            const syncedLeads = leads.filter(lead => lead.bitrix_lead_id).length;
            document.getElementById('statSyncedLeads').textContent = syncedLeads;

            const syncLogs = await window.supabaseCRM.getSyncLogs(10);

            if (syncLogs && syncLogs.length > 0) {
                const lastSync = new Date(syncLogs[0].created_at);
                document.getElementById('lastSyncTime').textContent = this.formatDateTime(lastSync);

                const failed = syncLogs.filter(log => log.status === 'failed').length;
                document.getElementById('failedSyncs').textContent = failed;
            } else {
                document.getElementById('lastSyncTime').textContent = 'No syncs yet';
                document.getElementById('failedSyncs').textContent = '0';
            }

        } catch (error) {
            console.error('Error loading statistics:', error);
            document.getElementById('statTotalLeads').textContent = 'Error';
            document.getElementById('statTodayLeads').textContent = 'Error';
            document.getElementById('statWeekLeads').textContent = 'Error';
            document.getElementById('statSyncedLeads').textContent = 'Error';
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.querySelector('i').style.animation = '';
            }
        }
    }

    async loadRecentActivity() {
        const container = document.getElementById('recentActivity');

        try {
            if (!window.supabaseCRM) {
                throw new Error('Supabase client not initialized');
            }

            const leads = await window.supabaseCRM.getLeads({});
            const recentLeads = leads.slice(0, 5);

            if (recentLeads.length === 0) {
                container.innerHTML = '<p class="no-data">No recent activity</p>';
                return;
            }

            container.innerHTML = recentLeads.map(lead => {
                const syncStatus = lead.bitrix_lead_id ? 'success' : 'failed';
                const syncText = lead.bitrix_lead_id ? 'Synced' : 'Not synced';

                return `
                    <div class="activity-item">
                        <div class="activity-item-header">
                            <div>
                                <span class="activity-item-title">New lead: ${lead.contact_name}</span>
                                <span class="activity-status ${syncStatus}">${syncText}</span>
                            </div>
                            <span class="activity-item-time">${this.formatDateTime(new Date(lead.created_at))}</span>
                        </div>
                        <div class="activity-item-details">
                            ${lead.apartment_id ? `Apartment ${lead.apartment_id}` : 'General inquiry'} •
                            ${lead.contact_email} •
                            ${lead.contact_phone}
                        </div>
                    </div>
                `;
            }).join('');

        } catch (error) {
            console.error('Error loading recent activity:', error);
            container.innerHTML = '<p class="no-data">Error loading activity</p>';
        }
    }

    showMessage(message, type) {
        const messageBox = document.getElementById('messageBox');
        messageBox.textContent = message;
        messageBox.className = `message-box show ${type}`;

        setTimeout(() => {
            messageBox.classList.remove('show');
        }, 5000);
    }

    formatDateTime(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});
