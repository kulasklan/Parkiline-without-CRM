class BitrixIntegration {
    constructor() {
        this.webhookUrl = '';
        this.isConfigured = false;
        this.debugMode = true;
    }

    configure(webhookUrl) {
        if (!webhookUrl) {
            console.error('Bitrix webhook URL is required');
            return false;
        }
        this.webhookUrl = webhookUrl;
        this.isConfigured = true;
        if (this.debugMode) {
            console.log('✅ Bitrix integration configured');
        }
        return true;
    }

    async createLead(leadData) {
        console.log('🔍 DIAGNOSTIC: Bitrix createLead called');
        console.log('🔍 DIAGNOSTIC: Bitrix isConfigured:', this.isConfigured);
        console.log('🔍 DIAGNOSTIC: Bitrix webhookUrl:', this.webhookUrl ? 'present' : 'missing');

        if (!this.isConfigured) {
            console.error('❌ Bitrix integration not configured');
            throw new Error('Bitrix integration not configured. Please set webhook URL.');
        }

        const bitrixLeadData = {
            fields: {
                TITLE: `Apartment ${leadData.apartment_id || 'Inquiry'} - ${leadData.contact_name}`,
                NAME: leadData.contact_name,
                EMAIL: [{ VALUE: leadData.contact_email, VALUE_TYPE: 'WORK' }],
                PHONE: [{ VALUE: leadData.contact_phone, VALUE_TYPE: 'WORK' }],
                SOURCE_ID: 'WEB',
                SOURCE_DESCRIPTION: leadData.source || 'ParkLine Website',
                COMMENTS: this.formatLeadComments(leadData),
                OPPORTUNITY: leadData.apartment_price || 0,
                CURRENCY_ID: 'EUR',
                UF_CRM_1: leadData.apartment_id,
                UF_CRM_2: leadData.apartment_floor,
                UF_CRM_3: leadData.apartment_size,
                UF_CRM_4: leadData.apartment_bedrooms
            }
        };

        console.log('🔍 DIAGNOSTIC: Bitrix lead data prepared:', JSON.stringify(bitrixLeadData, null, 2));

        try {
            console.log('🔍 DIAGNOSTIC: Sending request to Bitrix...');
            const response = await fetch(`${this.webhookUrl}/crm.lead.add.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bitrixLeadData)
            });

            console.log('🔍 DIAGNOSTIC: Bitrix response status:', response.status);
            console.log('🔍 DIAGNOSTIC: Bitrix response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Bitrix API error response:', errorText);
                throw new Error(`Bitrix API error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('🔍 DIAGNOSTIC: Bitrix result:', JSON.stringify(result, null, 2));

            if (result.error) {
                console.error('❌ Bitrix returned error:', result.error_description || result.error);
                throw new Error(`Bitrix error: ${result.error_description || result.error}`);
            }

            if (this.debugMode) {
                console.log('✅ Lead created in Bitrix:', result.result);
            }

            return {
                success: true,
                bitrixLeadId: result.result,
                data: result
            };

        } catch (error) {
            console.error('❌ Failed to create lead in Bitrix:', error);
            console.error('❌ Bitrix error details:', error.message);
            throw error;
        }
    }

    async updateLead(bitrixLeadId, updateData) {
        if (!this.isConfigured) {
            throw new Error('Bitrix integration not configured');
        }

        const bitrixUpdateData = {
            id: bitrixLeadId,
            fields: {}
        };

        if (updateData.status) {
            bitrixUpdateData.fields.STATUS_ID = this.mapStatusToBitrix(updateData.status);
        }
        if (updateData.assigned_to) {
            bitrixUpdateData.fields.ASSIGNED_BY_ID = updateData.assigned_to;
        }
        if (updateData.conversion_probability !== undefined) {
            bitrixUpdateData.fields.PROBABILITY = updateData.conversion_probability;
        }

        try {
            const response = await fetch(`${this.webhookUrl}/crm.lead.update.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bitrixUpdateData)
            });

            const result = await response.json();

            if (result.error) {
                throw new Error(`Bitrix error: ${result.error_description || result.error}`);
            }

            return {
                success: true,
                data: result
            };

        } catch (error) {
            console.error('Failed to update lead in Bitrix:', error);
            throw error;
        }
    }

    async getLead(bitrixLeadId) {
        if (!this.isConfigured) {
            throw new Error('Bitrix integration not configured');
        }

        try {
            const response = await fetch(`${this.webhookUrl}/crm.lead.get.json?id=${bitrixLeadId}`);
            const result = await response.json();

            if (result.error) {
                throw new Error(`Bitrix error: ${result.error_description || result.error}`);
            }

            return {
                success: true,
                data: result.result
            };

        } catch (error) {
            console.error('Failed to get lead from Bitrix:', error);
            throw error;
        }
    }

    async createActivity(leadId, activityData) {
        if (!this.isConfigured) {
            throw new Error('Bitrix integration not configured');
        }

        const bitrixActivityData = {
            fields: {
                OWNER_TYPE_ID: 1,
                OWNER_ID: leadId,
                TYPE_ID: this.mapActivityTypeToBitrix(activityData.activity_type),
                SUBJECT: activityData.subject || 'Activity',
                DESCRIPTION: activityData.description || '',
                DESCRIPTION_TYPE: 1,
                DIRECTION: 2,
                COMPLETED: activityData.completed_at ? 'Y' : 'N'
            }
        };

        if (activityData.scheduled_at) {
            bitrixActivityData.fields.START_TIME = activityData.scheduled_at;
        }
        if (activityData.completed_at) {
            bitrixActivityData.fields.END_TIME = activityData.completed_at;
        }

        try {
            const response = await fetch(`${this.webhookUrl}/crm.activity.add.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bitrixActivityData)
            });

            const result = await response.json();

            if (result.error) {
                throw new Error(`Bitrix error: ${result.error_description || result.error}`);
            }

            return {
                success: true,
                bitrixActivityId: result.result,
                data: result
            };

        } catch (error) {
            console.error('Failed to create activity in Bitrix:', error);
            throw error;
        }
    }

    async convertLeadToDeal(bitrixLeadId, dealData) {
        if (!this.isConfigured) {
            throw new Error('Bitrix integration not configured');
        }

        const bitrixDealData = {
            fields: {
                TITLE: dealData.title,
                LEAD_ID: bitrixLeadId,
                OPPORTUNITY: dealData.deal_value,
                CURRENCY_ID: 'EUR',
                PROBABILITY: dealData.probability || 50,
                STAGE_ID: this.mapStageToBitrix(dealData.stage),
                CLOSEDATE: dealData.expected_close_date || ''
            }
        };

        if (dealData.assigned_to) {
            bitrixDealData.fields.ASSIGNED_BY_ID = dealData.assigned_to;
        }

        try {
            const response = await fetch(`${this.webhookUrl}/crm.deal.add.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bitrixDealData)
            });

            const result = await response.json();

            if (result.error) {
                throw new Error(`Bitrix error: ${result.error_description || result.error}`);
            }

            return {
                success: true,
                bitrixDealId: result.result,
                data: result
            };

        } catch (error) {
            console.error('Failed to create deal in Bitrix:', error);
            throw error;
        }
    }

    formatLeadComments(leadData) {
        let comments = [];

        if (leadData.apartment_id) {
            comments.push(`Apartment: ${leadData.apartment_id}`);
        }
        if (leadData.apartment_floor) {
            comments.push(`Floor: ${leadData.apartment_floor}`);
        }
        if (leadData.apartment_size) {
            comments.push(`Size: ${leadData.apartment_size}m²`);
        }
        if (leadData.apartment_bedrooms) {
            comments.push(`Bedrooms: ${leadData.apartment_bedrooms}`);
        }
        if (leadData.apartment_price) {
            comments.push(`Price: €${leadData.apartment_price.toLocaleString()}`);
        }
        if (leadData.preferred_contact_method) {
            comments.push(`Preferred contact: ${leadData.preferred_contact_method}`);
        }
        if (leadData.message) {
            comments.push(`\nMessage: ${leadData.message}`);
        }

        return comments.join('\n');
    }

    mapStatusToBitrix(status) {
        const statusMap = {
            'new': 'NEW',
            'contacted': 'IN_PROCESS',
            'qualified': 'CONVERTED',
            'negotiation': 'IN_PROCESS',
            'won': 'CONVERTED',
            'lost': 'JUNK'
        };
        return statusMap[status] || 'NEW';
    }

    mapActivityTypeToBitrix(activityType) {
        const typeMap = {
            'call': 2,
            'meeting': 1,
            'email': 4,
            'message': 4,
            'note': 4
        };
        return typeMap[activityType] || 4;
    }

    mapStageToBitrix(stage) {
        const stageMap = {
            'qualification': 'NEW',
            'proposal': 'PREPAYMENT_INVOICE',
            'negotiation': 'EXECUTING',
            'contract': 'FINAL_INVOICE',
            'closed_won': 'WON',
            'closed_lost': 'LOSE'
        };
        return stageMap[stage] || 'NEW';
    }

    testConnection() {
        if (!this.isConfigured) {
            return {
                success: false,
                message: 'Bitrix webhook URL not configured'
            };
        }

        return fetch(`${this.webhookUrl}/crm.lead.list.json?order[ID]=DESC&filter[>ID]=0&select[]=ID&start=0`)
            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    return {
                        success: false,
                        message: `Connection failed: ${result.error_description || result.error}`
                    };
                }
                return {
                    success: true,
                    message: 'Successfully connected to Bitrix24'
                };
            })
            .catch(error => {
                return {
                    success: false,
                    message: `Connection error: ${error.message}`
                };
            });
    }
}

window.bitrixIntegration = new BitrixIntegration();
