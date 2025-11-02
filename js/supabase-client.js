class SupabaseCRMClient {
    constructor() {
        this.supabase = null;
        this.isInitialized = false;
        this.initAttempts = 0;
        this.maxInitAttempts = 3;
        this.init();
    }

    ensureInitialized() {
        if (!this.isInitialized && this.initAttempts < this.maxInitAttempts) {
            console.log('🔄 Attempting to re-initialize Supabase CRM...');
            this.init();
        }
        return this.isInitialized;
    }

    init() {
        this.initAttempts++;
        console.log(`🔍 DIAGNOSTIC: Initializing Supabase CRM client (attempt ${this.initAttempts}/${this.maxInitAttempts})...`);
        console.log('🔍 DIAGNOSTIC: window.CONFIG exists:', !!window.CONFIG);

        const supabaseUrl = window.CONFIG?.SUPABASE_URL;
        const supabaseKey = window.CONFIG?.SUPABASE_ANON_KEY;

        console.log('🔍 DIAGNOSTIC: Supabase URL:', supabaseUrl ? 'present' : 'missing');
        console.log('🔍 DIAGNOSTIC: Supabase Key:', supabaseKey ? 'present' : 'missing');

        if (!supabaseUrl || !supabaseKey) {
            console.error('❌ Supabase configuration missing');
            console.error('❌ URL:', supabaseUrl);
            console.error('❌ Key:', supabaseKey ? 'EXISTS' : 'MISSING');
            return;
        }

        console.log('🔍 DIAGNOSTIC: Checking for Supabase library...');
        console.log('🔍 DIAGNOSTIC: typeof supabase:', typeof supabase);
        console.log('🔍 DIAGNOSTIC: window.supabase:', typeof window.supabase);

        if (typeof supabase === 'undefined') {
            console.error('❌ Supabase library not loaded');
            console.error('❌ Make sure the Supabase CDN script is loaded before this file');
            return;
        }

        try {
            console.log('🔍 DIAGNOSTIC: Creating Supabase client...');
            this.supabase = supabase.createClient(supabaseUrl, supabaseKey);
            console.log('🔍 DIAGNOSTIC: Supabase client created:', !!this.supabase);

            if (this.supabase) {
                this.isInitialized = true;
                console.log('✅ Supabase CRM client initialized successfully');
            } else {
                console.error('❌ Failed to create Supabase client');
            }
        } catch (error) {
            console.error('❌ Error creating Supabase client:', error);
            console.error('❌ Error details:', error.message);
        }
    }

    async createLead(leadData) {
        console.log('🔍 DIAGNOSTIC: createLead called');
        console.log('🔍 DIAGNOSTIC: isInitialized:', this.isInitialized);
        console.log('🔍 DIAGNOSTIC: supabase client exists:', !!this.supabase);

        if (!this.isInitialized) {
            console.error('❌ Supabase client not initialized in createLead');
            throw new Error('Supabase client not initialized');
        }

        console.log('🔍 DIAGNOSTIC: Preparing insert data...');
        const insertData = {
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
        };

        console.log('🔍 DIAGNOSTIC: Insert data:', JSON.stringify(insertData, null, 2));
        console.log('🔍 DIAGNOSTIC: Executing Supabase insert...');

        try {
            const { data, error } = await this.supabase
                .from('leads')
                .insert([insertData])
                .select()
                .single();

            console.log('🔍 DIAGNOSTIC: Supabase response received');
            console.log('🔍 DIAGNOSTIC: Data:', data);
            console.log('🔍 DIAGNOSTIC: Error:', error);

            if (error) {
                console.error('❌ Supabase error creating lead:', error);
                console.error('❌ Error code:', error.code);
                console.error('❌ Error message:', error.message);
                console.error('❌ Error details:', JSON.stringify(error, null, 2));
                throw error;
            }

            console.log('✅ Lead successfully created in Supabase');
            return data;
        } catch (error) {
            console.error('❌ Exception in createLead:', error);
            throw error;
        }
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

    async getSyncLogs(limit = 10) {
        if (!this.isInitialized) {
            throw new Error('Supabase client not initialized');
        }

        const { data, error } = await this.supabase
            .from('sync_log')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Supabase error getting sync logs:', error);
            throw error;
        }

        return data || [];
    }
}

window.supabaseCRM = new SupabaseCRMClient();
