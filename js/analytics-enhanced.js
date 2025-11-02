// Enhanced Analytics Features for ParkLine Residences
// Additional functionality to complement the main analytics dashboard

// =====================================================
// ENHANCED ANALYTICS FEATURES
// =====================================================

// Display apartment performance analytics
async function displayApartmentPerformance(events) {
    try {
        const apartmentMetrics = calculateApartmentPerformance(events);
        console.log('📊 Apartment performance calculated:', apartmentMetrics.length, 'apartments');
        
        // Log top performing apartments
        apartmentMetrics.slice(0, 3).forEach((apt, index) => {
            console.log(`🏆 Top ${index + 1}: ${apt.apartment_id} - ${apt.views} views, ${apt.conversionRate}% conversion`);
        });
        
    } catch (error) {
        console.error('❌ Error displaying apartment performance:', error);
    }
}

// Calculate apartment performance metrics
function calculateApartmentPerformance(events) {
    const apartmentData = {};
    
    events.forEach(event => {
        if (event.apartment_id) {
            if (!apartmentData[event.apartment_id]) {
                apartmentData[event.apartment_id] = {
                    apartment_id: event.apartment_id,
                    views: 0,
                    interests: 0,
                    leads: 0,
                    estimatedRevenue: 0
                };
            }
            
            const apt = apartmentData[event.apartment_id];
            
            if (event.event_type === 'apartment_clicked') {
                apt.views++;
            } else if (event.event_type === 'interested_clicked') {
                apt.interests++;
                apt.estimatedRevenue += 2500;
            } else if (event.event_type === 'lead_submitted') {
                apt.leads++;
                apt.estimatedRevenue += 5000;
            }
        }
    });
    
    return Object.values(apartmentData)
        .map(apt => ({
            ...apt,
            conversionRate: apt.views > 0 ? Math.round((apt.interests / apt.views) * 100) : 0
        }))
        .sort((a, b) => b.views - a.views);
}

// Display lead conversion metrics
async function displayLeadConversionMetrics(events) {
    try {
        const conversionData = calculateLeadConversion(events);
        console.log('📈 Lead conversion metrics:', conversionData);
        
        // Log key conversion insights
        console.log(`🎯 Conversion Rate: ${conversionData.conversionRate}%`);
        console.log(`⏱️ Average Time to Lead: ${conversionData.avgTimeToLead} minutes`);
        console.log(`🔥 Hot Leads (< 30min): ${conversionData.hotLeads}`);
        
    } catch (error) {
        console.error('❌ Error displaying lead conversion metrics:', error);
    }
}

// Calculate lead conversion metrics
function calculateLeadConversion(events) {
    const sessions = {};
    
    events.forEach(event => {
        if (!sessions[event.session_id]) {
            sessions[event.session_id] = {
                startTime: new Date(event.created_at),
                events: [],
                converted: false,
                timeToLead: null
            };
        }
        
        sessions[event.session_id].events.push(event);
        
        if (event.event_type === 'lead_submitted') {
            sessions[event.session_id].converted = true;
            sessions[event.session_id].timeToLead = 
                (new Date(event.created_at) - sessions[event.session_id].startTime) / (1000 * 60);
        }
    });
    
    const sessionArray = Object.values(sessions);
    const convertedSessions = sessionArray.filter(s => s.converted);
    const conversionRate = sessionArray.length > 0 ? 
        Math.round((convertedSessions.length / sessionArray.length) * 100) : 0;
    
    const avgTimeToLead = convertedSessions.length > 0 ?
        Math.round(convertedSessions.reduce((sum, s) => sum + s.timeToLead, 0) / convertedSessions.length) : 0;
    
    const hotLeads = convertedSessions.filter(s => s.timeToLead < 30).length;
    
    return {
        conversionRate,
        avgTimeToLead,
        hotLeads,
        totalSessions: sessionArray.length,
        convertedSessions: convertedSessions.length
    };
}

// Display real-time metrics
function displayRealTimeMetrics(events) {
    try {
        const recentEvents = events.filter(event => {
            const eventTime = new Date(event.created_at);
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            return eventTime > oneHourAgo;
        });
        
        const liveVisitors = new Set(recentEvents.map(e => e.session_id)).size;
        const activeViewing = recentEvents.filter(e => e.event_type === 'apartment_clicked').length;
        const recentInterests = recentEvents.filter(e => e.event_type === 'interested_clicked').length;
        
        console.log(`⚡ Real-time: ${liveVisitors} visitors, ${activeViewing} viewing, ${recentInterests} interests`);
        
        // Update real-time indicators (if elements exist)
        const liveIndicator = document.getElementById('liveVisitorsCount');
        if (liveIndicator) liveIndicator.textContent = liveVisitors;
        
    } catch (error) {
        console.error('❌ Error displaying real-time metrics:', error);
    }
}

// Display revenue analytics
function displayRevenueAnalytics(events) {
    try {
        const revenueData = calculateRevenueMetrics(events);
        console.log('💰 Revenue analytics:', revenueData);
        
        // Log revenue insights
        console.log(`💶 Total Revenue: €${(revenueData.totalRevenue).toLocaleString()}`);
        console.log(`📊 Pipeline Value: €${(revenueData.pipelineValue).toLocaleString()}`);
        console.log(`📈 Average Deal Value: €${(revenueData.avgDealValue).toLocaleString()}`);
        
    } catch (error) {
        console.error('❌ Error displaying revenue analytics:', error);
    }
}

// Calculate revenue metrics
function calculateRevenueMetrics(events) {
    const leadEvents = events.filter(e => e.event_type === 'lead_submitted');
    const interestEvents = events.filter(e => e.event_type === 'interested_clicked');
    
    const totalRevenue = leadEvents.length * 250000; // Average apartment price in EUR
    const pipelineValue = interestEvents.length * 150000; // Potential revenue from interests
    const avgDealValue = leadEvents.length > 0 ? totalRevenue / leadEvents.length : 250000;
    
    return {
        totalRevenue,
        pipelineValue,
        avgDealValue,
        totalLeads: leadEvents.length,
        totalInterests: interestEvents.length
    };
}

// Enhanced utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('mk-MK', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Enhanced analytics tracking for lead submissions
function trackEnhancedLeadSubmission(leadData) {
    if (window.Analytics && window.Analytics.isInitialized) {
        window.Analytics.trackEvent('lead_submitted', {
            apartment_id: leadData.apartment_id,
            source: 'contact_modal',
            budget: leadData.budget,
            priority: leadData.priority || 'medium',
            timestamp: new Date().toISOString()
        });
        
        console.log('📊 Enhanced lead submission tracked:', leadData.apartment_id);
    }
}

// Enhanced apartment view tracking
function trackEnhancedApartmentView(apartmentData) {
    if (window.Analytics && window.Analytics.isInitialized) {
        window.Analytics.trackEvent('apartment_view_detailed', {
            apartment_id: apartmentData.id,
            bedrooms: apartmentData.bedrooms,
            floor: apartmentData.floor,
            area: apartmentData.area,
            status: apartmentData.status,
            price_monthly: apartmentData.price_monthly,
            view_duration: apartmentData.viewDuration || 0,
            timestamp: new Date().toISOString()
        });
        
        console.log('📊 Enhanced apartment view tracked:', apartmentData.id);
    }
}

// Initialize enhanced analytics features
function initializeEnhancedAnalytics() {
    console.log('✅ Enhanced Analytics Features loaded');
    
    // Make functions globally available
    window.displayApartmentPerformance = displayApartmentPerformance;
    window.displayLeadConversionMetrics = displayLeadConversionMetrics;
    window.displayRealTimeMetrics = displayRealTimeMetrics;
    window.displayRevenueAnalytics = displayRevenueAnalytics;
    window.trackEnhancedLeadSubmission = trackEnhancedLeadSubmission;
    window.trackEnhancedApartmentView = trackEnhancedApartmentView;
}

// Auto-initialize when loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEnhancedAnalytics);
} else {
    initializeEnhancedAnalytics();
}

console.log('🚀 Enhanced Analytics Module Loaded - Advanced tracking and reporting available');