# Bitrix24 Webhook Setup - Quick Reference

## Your Webhook URL
```
https://b24-tvr028.bitrix24.com/rest/1/nk6ec8cp1ls7ra6j/
```

## Step-by-Step Permission Configuration

### 1. Access Bitrix24 Webhook Settings
- Open your Bitrix24 account
- Navigate to: **Menu → Developer Resources → Other → Inbound Webhook**
- Find your existing webhook or the one you're configuring

### 2. Assign Permissions
1. In the "Assign permissions" section, click the **"select"** button (blue plus icon)
2. From the list that appears, **check the box next to "CRM"**
3. Click **"Save"** or **"Apply"**
4. Click the green **"SAVE"** button at the bottom of the page

### 3. What "CRM" Scope Includes
When you select the "CRM" scope, you automatically get access to **ALL** CRM-related methods:
- `crm.lead.add` - Create leads
- `crm.lead.update` - Update leads
- `crm.lead.get` - Read lead data
- `crm.lead.list` - List leads
- `crm.deal.add` - Create deals
- `crm.deal.update` - Update deals
- `crm.activity.add` - Add activities
- `crm.contact.add` - Add contacts
- And all other CRM operations

## Important Notes

### You DO NOT need to select individual methods
- ❌ You won't see options like "crm.lead.add" or "crm.lead.update"
- ✅ You only need to select the **"CRM"** scope/module

### Webhook Configuration is Complete
Your webhook URL has been configured in:
- `/js/config.js` - Set as default configuration
- Admin Panel - Can be tested and updated via `admin.html`

## Testing the Integration

### Method 1: Via Admin Panel
1. Open `admin.html` in your browser
2. The webhook URL should already be populated
3. Click **"Test Connection"** button
4. You should see "Successfully connected to Bitrix24"

### Method 2: Via Website
1. Open `index.html` in your browser
2. Click on any available apartment
3. Click "Изрази интерес" (Express Interest)
4. Fill in the form and submit
5. Check your Bitrix24 CRM → Leads for the new lead

## Verification Checklist

- [ ] Bitrix24 webhook created
- [ ] "CRM" scope/permission selected and saved
- [ ] Webhook URL copied and configured in project
- [ ] Connection test successful in admin panel
- [ ] Test lead successfully created in Bitrix24
- [ ] Lead data appears correctly in Bitrix24 CRM

## Troubleshooting

### Error: "Connection failed"
- Verify the webhook URL is correct
- Check that "CRM" permission is selected in Bitrix24
- Ensure webhook is still active in Bitrix24

### Error: "403 Forbidden"
- The "CRM" permission is not enabled
- Go back to Bitrix24 and add "CRM" scope

### Error: "404 Not Found"
- Webhook URL is incorrect
- Webhook may have been deleted in Bitrix24

## What Happens Next

When a visitor expresses interest in an apartment:

1. **Lead Form Submitted** → Website captures the information
2. **Dual Storage**:
   - Lead saved to **Supabase** (backup/analytics)
   - Lead created in **Bitrix24 CRM** (primary system)
3. **Bitrix24 Lead Created** with:
   - Contact name, email, phone
   - Apartment details (ID, floor, size, bedrooms, price)
   - Source: "ParkLine Website"
4. **Your Sales Team** manages the lead in Bitrix24 CRM
5. **Admin Panel** shows sync status and statistics

## Additional Resources

- Full documentation: See `BITRIX_CRM_SETUP.md`
- Admin panel: Open `admin.html` to manage and monitor
- Analytics: Open `analytics.html` to view lead statistics

---

**Last Updated:** November 2, 2025
**Webhook Status:** ✅ Configured and Ready
