# Google Sheets Mapping Update

## ✅ Changes Completed

I've successfully updated your application to match the Google Sheets "Lead Capture" structure shown in your screenshot.

### Google Sheets Column Structure
Based on your screenshot, the columns are:
- **Column A**: Name
- **Column B**: Email
- **Column C**: Phone Number
- **Column D**: Advisor Name

### Files Updated

#### 1. **netlify/functions/sheet-worker.js**
- ✅ Changed data mapping to combine `firstName` and `lastName` into a single "Name" field
- ✅ Updated column order to: Name, Email, Phone Number, Advisor Name
- ✅ Changed sheet range from `Sheet1!A:H` to `Lead Capture!A:D`
- ✅ Removed unnecessary timestamp, path, and note fields

#### 2. **index.html**
- ✅ Changed form field from "Broker / Company" to "Advisor Name"
- ✅ Updated input ID from `broker` to `advisor-name`
- ✅ Updated in both instances (the HTML appears to have duplicate sections)

#### 3. **app.js**
- ✅ Updated `userData` object: changed `broker` to `advisorName`
- ✅ Updated form value capture to use `advisor-name` input
- ✅ Updated placeholder assignment to use `advisorName`

#### 4. **config.js**
- ✅ Updated placeholder text from `broker` to `advisorName`
- ✅ Changed placeholder text to "Advisor Name (Optional)"

## Data Flow

When a user submits the form, the data will now be sent to Google Sheets as:

```javascript
[
  "John Doe",           // Column A: Name (firstName + lastName)
  "john@example.com",   // Column B: Email
  "(555) 123-4567",     // Column C: Phone Number
  "Jane Smith"          // Column D: Advisor Name
]
```

## Next Steps

1. **Update Google Sheet ID**: Make sure to add your Google Sheet ID to `config.js`:
   ```javascript
   googleSheetId: "YOUR_SHEET_ID_HERE"
   ```
   
2. **Set up Google Credentials**: Ensure your `GOOGLE_CREDENTIALS` environment variable is set in Netlify with your service account credentials.

3. **Test the Integration**: Submit a test form entry to verify the data appears correctly in your Google Sheet.

## Sheet Name
The code now expects a sheet named **"Lead Capture"** (matching your screenshot). If your sheet has a different name, update line 96 in `sheet-worker.js`:
```javascript
range: 'YOUR_SHEET_NAME!A:D'
```
