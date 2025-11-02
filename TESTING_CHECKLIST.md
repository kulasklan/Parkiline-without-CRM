# Lead Form Testing Checklist

## Prerequisites
- ✅ Supabase library loaded from CDN
- ✅ Supabase configuration present in config.js
- ✅ Scripts loaded in correct order in index.html
- ✅ JavaScript syntax validated

## Test 1: Form Display
1. Open the application in browser
2. Click on any apartment in the building visualization
3. **Expected**: Form opens with apartment details panel
4. **Check**: Details show clean values like "Спрат: 9" NOT like "Спрат: {"value":"9"...}"
5. **Check**: All field labels are in Macedonian (or selected language)

## Test 2: Form Validation
1. Click "Испрати барање" without filling the form
2. **Expected**: Validation errors appear for required fields
3. Fill in only name, leave email empty
4. **Expected**: Email validation error appears
5. Fill all required fields correctly
6. **Expected**: No validation errors, form proceeds to submit

## Test 3: Form Submission (Success)
1. Fill out all required fields with valid data
2. Click "Испрати барање"
3. **Expected**: 
   - Button shows "Се испраќа..." with loading state
   - Console logs show:
     ```
     📋 Extracted lead data: {...}
     🔄 Creating lead in Bitrix... (if configured)
     🔄 Saving lead to Supabase...
     ✅ Lead saved to Supabase: [ID]
     ✅ Form submission complete!
     ```
   - Success message appears: "✅ Вашето барање е успешно испратено!"
   - Form closes automatically after 3 seconds

## Test 4: Data Extraction
1. Open browser console (F12)
2. Click on an apartment to open form
3. Fill and submit the form
4. **Check** console log "📋 Extracted lead data:"
5. **Verify** the data contains:
   - apartment_id: (apartment number)
   - apartment_floor: (numeric floor number, not object)
   - apartment_size: (numeric area, not object)
   - apartment_bedrooms: (numeric count, not object)
   - contact_name, contact_email, contact_phone: (your input)

## Test 5: Error Handling (Network Timeout)
1. Open browser DevTools → Network tab
2. Enable "Offline" mode or throttle to "Slow 3G"
3. Fill and submit form
4. **Expected**:
   - After ~10 seconds, shows error: "❌ Барањето истече..."
   - Form unlocks (button becomes clickable again)
   - No form stuck in loading state

## Test 6: Error Handling (Supabase Not Initialized)
1. Open browser console
2. Run: `window.supabaseCRM.isInitialized = false`
3. Fill and submit form
4. **Expected**: 
   - Error message: "❌ Системот не е правилно конфигуриран..."
   - Form doesn't get stuck

## Test 7: Database Verification
1. After successful submission, log into Supabase dashboard
2. Navigate to: Table Editor → leads table
3. **Verify**: New row exists with:
   - Correct apartment_id
   - Numeric values for floor, size, bedrooms (not JSON strings)
   - Contact information
   - Timestamp

## Test 8: Multi-language Support
1. Change language using language selector (if available)
2. Click on apartment
3. **Verify**: Form labels change to selected language
4. **Verify**: Apartment details use translated field names

## Troubleshooting

### If form still shows JSON objects:
1. Check browser console for errors
2. Verify Google Sheets data structure matches expected format
3. Check that apartment.data has nested objects with .value property

### If form gets stuck:
1. Check browser console for errors
2. Verify Supabase URL and key in config.js
3. Check network tab for failed requests
4. Verify Supabase database tables exist

### If data extraction fails:
1. Check console log "📋 Extracted lead data:"
2. Verify field names in Google Sheets match keywords
3. Check that apartment object has required properties

## Console Commands for Debugging

```javascript
// Check Supabase status
console.log('Supabase initialized:', window.supabaseCRM?.isInitialized);

// Check current apartment data structure
console.log('Current apartment:', window.leadFormManager?.currentApartment);

// Test data extraction
const apt = window.leadFormManager?.currentApartment;
if (apt) {
  console.log('Data structure:', apt.data);
  console.log('Sample field:', Object.values(apt.data)[0]);
}

// Check configurations
console.log('Supabase URL:', window.CONFIG?.SUPABASE_URL);
console.log('Bitrix configured:', window.bitrixIntegration?.isConfigured);
```
