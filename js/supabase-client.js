class SupabaseCRMClient {
    constructor() {
        this.supabase = null;
        this.isInitialized = false;
        this.init();
    }

    init() {
        const supabaseUrl = window.CONFIG?.SUPABASE_URL || import.meta?.env?.VITE_SUPABASE_URL;
        const supabaseKey = window.CONFIG?.SUPABASE_ANON_KEY || import.meta?.env?.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('Supabase configuration missing');
            return;
        }

        this.supabase = window.supabase?.createClient(supabaseUrl, supabaseKey);

        if (this.supabase) {
            this.isInitialized = true;
            console.log('✅ Supabase CRM client initialized');
        }
    }

    async createLead(leadData) {
        if (!this.isInitialized) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await this.supabase
            .from('leads')
            .insert([{
                apartment_id: leadData.apartment_id,
                apartment_floor: leadData.apartment_floor,
                apartment_size: leadData.apartment_size,
                apartment_price: leadData.apartment_price,
                apartment_bedrooms: leadData.apartment_bedrooms,
                contact_name: leadData.contact_name,
                contact_email: leadData.contact_email,
                contact_phone: leadData.contact_phone,
                preferred_contact_method: leadData.preferred_contact_method || 'phone',
                message: leadData.message,
                status: 'new',
                source: leadData.source || window.location.pathname,
                bitrix_lead_id: leadData.bitrix_lead_id
            }])
            .select()
            .single();

        if (error) {
            console.error('Supabase error creating lead:', error);
            throw error;
        }

        return data;
    }

    async updateLead(leadId, updateData) {
        if (!this.isInitialized) {
            throw new Error('Supabase client not initialized');
        }

        const updates = {
            ...updateData,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await this.supabase
            .from('leads')
            .update(updates)
            .eq('id', leadId)
            .select()
            .single();

        if (error) {
            console.error('Supabase error updating lead:', error);
            throw error;
        }

        return data;
    }

    async getLead(leadId) {
        if (!this.isInitialized) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await this.supabase
            .from('leads')
            .select('*')
            .eq('id', leadId)
            .maybeSingle();

        if (error) {
            console.error('Supabase error getting lead:', error);
            throw error;
        }

        return data;
    }

    async getLeads(filters = {}) {
        if (!this.isInitialized) {
            throw new Error('Supabase client not initialized');
        }

        let query = this.supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        if (filters.assigned_to) {
            query = query.eq('assigned_to', filters.assigned_to);
        }
        if (filters.from_date) {
            query = query.gte('created_at', filters.from_date);
        }
        if (filters.to_date) {
            query = query.lte('created_at', filters.to_date);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Supabase error getting leads:', error);
            throw error;
        }

        return data || [];
    }

    async createActivity(activityData) {
        if (!this.isInitialized) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await this.supabase
            .from('lead_activities')
            .insert([activityData])
            .select()
            .single();

        if (error) {
            console.error('Supabase error creating activity:', error);
            throw error;
        }

        return data;
    }

    async getActivitiesForLead(leadId) {
        if (!this.isInitialized) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await this.supabase
            .from('lead_activities')
            .select('*')
            .eq('lead_id', leadId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error getting activities:', error);
            throw error;
        }

        return data || [];
    }

    async createOpportunity(opportunityData) {
        if (!this.isInitialized) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await this.supabase
            .from('opportunities')
            .insert([opportunityData])
            .select()
            .single();

        if (error) {
            console.error('Supabase error creating opportunity:', error);
            throw error;
        }

        return data;
    }

    async updateOpportunity(opportunityId, updateData) {
        if (!this.isInitialized) {
            throw new Error('Supabase client not initialized');
        }

        const updates = {
            ...updateData,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await this.supabase
            .from('opportunities')
            .update(updates)
            .eq('id', opportunityId)
            .select()
            .single();

        if (error) {
            console.error('Supabase error updating opportunity:', error);
            throw error;
        }

        return data;
    }

    async getOpportunities(filters = {}) {
        if (!this.isInitialized) {
            throw new Error('Supabase client not initialized');
        }

        let query = this.supabase
            .from('opportunities')
            .select(`
                *,
                leads (
                    contact_name,
                    contact_email,
                    contact_phone
                )
            `)
            .order('created_at', { ascending: false });

        if (filters.stage) {
            query = query.eq('stage', filters.stage);
        }
        if (filters.assigned_to) {
            query = query.eq('assigned_to', filters.assigned_to);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Supabase error getting opportunities:', error);
            throw error;
        }

        return data || [];
    }

    async logSync(syncData) {
        if (!this.isInitialized) {
            throw new Error('Supabase client not initialized');
        }

        const { error } = await this.supabase
            .from('sync_log')
            .insert([syncData]);

        if (error) {
            console.error('Supabase error logging sync:', error);
        }
    }

    async getLeadStats() {
        if (!this.isInitialized) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await this.supabase
            .from('leads')
            .select('status');

        if (error) {
            console.error('Supabase error getting stats:', error);
            return null;
        }

        const stats = {
            total: data.length,
            new: 0,
            contacted: 0,
            qualified: 0,
            negotiation: 0,
            won: 0,
            lost: 0
        };

        data.forEach(lead => {
            if (stats[lead.status] !== undefined) {
                stats[lead.status]++;
            }
        });

        return stats;
    }

    async getConversionMetrics() {
        if (!this.isInitialized) {
            throw new Error('Supabase client not initialized');
        }

        const { data: leads, error: leadsError } = await this.supabase
            .from('leads')
            .select('status, created_at');

        const { data: opportunities, error: oppsError } = await this.supabase
            .from('opportunities')
            .select('stage, deal_value');

        if (leadsError || oppsError) {
            console.error('Error getting conversion metrics');
            return null;
        }

        const totalLeads = leads.length;
        const convertedToOpportunity = opportunities.length;
        const wonDeals = opportunities.filter(opp => opp.stage === 'closed_won').length;
        const totalRevenue = opportunities
            .filter(opp => opp.stage === 'closed_won')
            .reduce((sum, opp) => sum + parseFloat(opp.deal_value || 0), 0);

        return {
            totalLeads,
            convertedToOpportunity,
            conversionRate: totalLeads > 0 ? (convertedToOpportunity / totalLeads * 100).toFixed(2) : 0,
            wonDeals,
            winRate: convertedToOpportunity > 0 ? (wonDeals / convertedToOpportunity * 100).toFixed(2) : 0,
            totalRevenue
        };
    }
}

window.supabaseCRM = new SupabaseCRMClient();
