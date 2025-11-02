# Bitrix24 CRM Integration Setup Guide

## Overview

This guide will walk you through setting up Bitrix24 CRM integration for your ParkLine Residences apartment visualization website. The integration allows you to:

- Automatically create leads in Bitrix24 when users express interest in apartments
- Store lead backups in Supabase database for redundancy and analytics
- Manage all CRM operations directly in Bitrix24
- Track sales pipeline and conversions in your Bitrix24 account
- Monitor sync status and connection health

## Prerequisites

1. **Bitrix24 Account**: You need an active Bitrix24 account (free or paid)
2. **Supabase Database**: Already configured in your project
3. **Website Access**: Access to your ParkLine website files

## Step 1: Create Bitrix24 Webhook

### 1.1 Access Bitrix24 Developer Settings

1. Log in to your Bitrix24 account (e.g., `yourcompany.bitrix24.com`)
2. Click on your profile picture in the top-right corner
3. Select **"Developers resources"** or **"Developer tools"**
4. Click on **"Inbound webhook"** or **"Webhooks"**

### 1.2 Create New Webhook

1. Click **"Add webhook"** or **"Create new webhook"**
2. Give it a descriptive name: `ParkLine Website Integration`
3. Select the following permissions:
   - **CRM (crm)**: All permissions or at minimum:
     - `crm.lead.add` - Create leads
     - `crm.lead.update` - Update leads
     - `crm.lead.get` - Read leads
     - `crm.activity.add` - Add activities
     - `crm.deal.add` - Create deals
     - `crm.deal.update` - Update deals
4. Click **"Save"**

### 1.3 Copy Webhook URL

After creating the webhook, you'll receive a URL that looks like:

```
https://yourcompany.bitrix24.com/rest/1/abc123xyz456/
```

**IMPORTANT**: Save this URL securely. You'll need it in the next step.

## Step 2: Configure Website Integration

### 2.1 Update Configuration File

1. Open the file `js/config.js` in your website project
2. Find the line with `BITRIX_WEBHOOK_URL: ''`
3. Replace it with your webhook URL:

```javascript
BITRIX_WEBHOOK_URL: 'https://yourcompany.bitrix24.com/rest/1/abc123xyz456/'
```

4. Save the file

### 2.2 Test the Integration

1. Open your website in a browser
2. Navigate to the Admin Panel: `admin.html`
3. Paste your webhook URL in the Bitrix24 configuration section
4. Click **"Test Connection"**
5. You should see a success message if the connection works

## Step 3: Customize Bitrix24 Fields (Optional)

### 3.1 Create Custom Fields for Leads

To better track apartment-specific information in Bitrix24:

1. Go to **CRM** → **Settings** → **Lead Settings**
2. Click **"Fields"** or **"Custom fields"**
3. Add these custom fields:
   - **Apartment ID** (Text field)
   - **Floor** (Number field)
   - **Apartment Size** (Number field, suffix: m²)
   - **Number of Bedrooms** (Number field)

### 3.2 Update Field Mappings

If you created custom fields with different IDs, update the mapping in `js/bitrix-integration.js`:

Find this section:
```javascript
UF_CRM_1: leadData.apartment_id,
UF_CRM_2: leadData.apartment_floor,
UF_CRM_3: leadData.apartment_size,
UF_CRM_4: leadData.apartment_bedrooms
```

Replace `UF_CRM_1`, `UF_CRM_2`, etc., with your actual custom field IDs from Bitrix24.

## Step 4: Test Lead Creation

### 4.1 Submit Test Lead from Website

1. Go to your main website (`index.html`)
2. Click on any **available** apartment
3. Click the **"Изрази интерес"** (Express Interest) button
4. Fill in the form with test data:
   - Name: Test User
   - Email: test@example.com
   - Phone: +389 70 123 456
5. Submit the form

### 4.2 Verify in Bitrix24

1. Log in to your Bitrix24 account
2. Go to **CRM** → **Leads**
3. You should see a new lead with:
   - Title: "Apartment [ID] - Test User"
   - Contact information
   - Apartment details in comments or custom fields
   - Source: "ParkLine Website"

## Step 5: Managing Leads in Bitrix24

### 5.1 Automatic Assignment Rules

In Bitrix24, you can set up automatic assignment rules:

1. Go to **CRM** → **Settings** → **Automation Rules**
2. Create a rule for new leads from "Web Source"
3. Set assignment to:
   - Round-robin to sales team
   - Specific user
   - Based on criteria (price range, apartment type, etc.)

### 5.2 Lead Management

All lead management happens directly in your Bitrix24 account:
- View and update lead information
- Add activities (calls, meetings, emails)
- Move leads through your sales pipeline
- Convert qualified leads to deals
- Track opportunities and close rates

## Step 6: Data Storage Architecture

### 6.1 Dual Storage System

Your system uses a dual storage approach:

**Supabase Database (Local Backup):**
- Stores all leads automatically
- Provides data redundancy
- Enables custom analytics and reporting
- Maintains sync logs for troubleshooting

**Bitrix24 CRM (Primary System):**
- Receives all leads via API
- Main platform for lead management
- Sales team works here exclusively
- Full CRM features and automation

### 6.2 Benefits

This architecture ensures:
- No data loss if Bitrix24 API is temporarily unavailable
- Ability to create custom reports from Supabase
- Complete audit trail of all submissions
- Seamless user experience on website

## Troubleshooting

### Connection Issues

**Error: "Bitrix webhook URL not configured"**
- Solution: Set the webhook URL in config.js or Settings

**Error: "HTTP 403 Forbidden"**
- Solution: Check webhook permissions in Bitrix24
- Ensure webhook has CRM access rights

**Error: "HTTP 404 Not Found"**
- Solution: Verify webhook URL is correct
- Check if webhook is still active in Bitrix24

### Data Sync Issues

**Leads not appearing in Bitrix24:**
1. Check browser console for errors
2. Verify webhook URL is correct
3. Test connection in Settings
4. Check Bitrix24 webhook logs

**Custom fields not saving:**
1. Verify custom field IDs match in code
2. Check field permissions in Bitrix24
3. Update field mappings in bitrix-integration.js

### Performance Issues

**Slow form submission:**
- Normal: Can take 2-3 seconds due to API calls
- If longer: Check your internet connection
- Check Bitrix24 service status

## Data Privacy & Security

### Best Practices

1. **Secure Webhook URL**: Never commit webhook URL to public repositories
2. **HTTPS Only**: Always use HTTPS for your website
3. **Data Backup**: Leads are saved in Supabase as backup
4. **Access Control**: Limit CRM Dashboard access to authorized users
5. **GDPR Compliance**: Ensure consent before collecting personal data

### Data Storage

- **Supabase**: All leads and activities stored as primary database
- **Bitrix24**: Synced for CRM workflow and sales management
- **Sync Log**: All API operations logged for debugging

## Advanced Configuration

### Custom Status Mappings

Edit `js/bitrix-integration.js` to customize status mappings:

```javascript
mapStatusToBitrix(status) {
    const statusMap = {
        'new': 'NEW',
        'contacted': 'IN_PROCESS',
        'qualified': 'CONVERTED',
        // Add your custom mappings
    };
    return statusMap[status] || 'NEW';
}
```

### Email Notifications

To enable email notifications in Bitrix24:

1. Go to **CRM** → **Settings** → **Automation**
2. Create automation rules for:
   - New lead created
   - Lead status changed
   - Activity completed
3. Add email action with custom template

## Support & Resources

### Documentation

- Bitrix24 REST API: https://dev.bitrix24.com/rest_help/
- Supabase Docs: https://supabase.com/docs
- Project Documentation: See README.md

### Common Questions

**Q: Can I use OAuth instead of webhooks?**
A: Yes, but webhooks are simpler for single-portal integration.

**Q: Does this work with Bitrix24 free plan?**
A: Yes, webhooks work with free plans, but have API rate limits.

**Q: Can I customize the lead form fields?**
A: Yes, edit `js/lead-form.js` and update the form HTML.

**Q: Where do I manage my sales team?**
A: All sales team management, user permissions, and access control is handled in Bitrix24.

**Q: Can I see lead statistics without logging into Bitrix24?**
A: Yes, use the admin panel at `admin.html` to view basic statistics and sync status.

## Next Steps

1. ✅ Set up Bitrix24 webhook
2. ✅ Configure website integration
3. ✅ Test lead creation
4. ✅ Train sales team on Bitrix24 CRM
5. ✅ Configure automated assignment rules
6. ✅ Set up Bitrix24 workflows and automation
7. ✅ Monitor leads and conversion rates in Bitrix24

## Summary

Your ParkLine Residences website now integrates seamlessly with Bitrix24 CRM:

- **Website visitors** fill out the interest form on your website
- **System automatically** saves lead to Supabase and creates lead in Bitrix24
- **Sales team** manages all leads exclusively in Bitrix24
- **Admin panel** provides configuration and basic monitoring
- **Backup data** stored in Supabase for redundancy and reporting

All CRM operations, lead management, and sales activities happen in your Bitrix24 account.
