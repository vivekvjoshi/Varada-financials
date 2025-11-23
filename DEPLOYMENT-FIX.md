# 🚀 DEPLOYMENT FIX - Updated Instructions

## ✅ The Error is Fixed!

The deployment error happened because `credentials.json` was in `.gitignore` but the function tried to require it unconditionally.

**The function now works with ONLY environment variables** - no credentials.json needed!

---

## 📋 How to Deploy Successfully

### Step 1: Push Your Code
```bash
git add .
git commit -m "Deploy video advisor app"
git push origin main
```

### Step 2: Add Environment Variable in Netlify

1. Go to your Netlify dashboard
2. Select your site
3. Go to **Site Settings** → **Environment Variables**
4. Click **Add a variable**
5. Set:
   - **Key**: `GOOGLE_CREDENTIALS`
   - **Value**: Your entire Google Service Account JSON (paste as one line or multi-line, both work)

Example of what to paste:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  ...
}
```

6. Click **Save**
7. Go to **Deploys** → **Trigger deploy** → **Deploy site**

---

## ⚡ Quick Checklist

- [ ] Push code to Git
- [ ] Add `GOOGLE_CREDENTIALS` environment variable in Netlify
- [ ] Trigger a new deploy
- [ ] Test the form submission
- [ ] Check Google Sheet for data

---

## 🎯 What Changed

**Before**: Function required `credentials.json` file → ❌ Failed because file was in `.gitignore`

**Now**: Function tries environment variable first, then falls back to file → ✅ Works!

```javascript
// New logic:
if (process.env.GOOGLE_CREDENTIALS) {
    // Use env var (Netlify)
} else {
    try {
        // Try local file (local testing)
    } catch {
        // Fail gracefully with helpful error
    }
}
```

---

## 🔍 How to Get Google Credentials

If you haven't created them yet:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable **Google Sheets API**
4. Go to **IAM & Admin** → **Service Accounts**
5. Click **Create Service Account**
6. Give it a name, click **Create**
7. Skip roles, click **Continue**
8. Click **Done**
9. Click on the service account you just created
10. Go to **Keys** tab
11. Click **Add Key** → **Create new key**
12. Choose **JSON**
13. Download the file
14. Copy the entire JSON content
15. Paste it as the `GOOGLE_CREDENTIALS` value in Netlify

Then:
16. Open your Google Sheet
17. Click **Share**
18. Paste the service account email (from the JSON, looks like `xxx@xxx.iam.gserviceaccount.com`)
19. Give it **Editor** access
20. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
21. Paste it in `config.js` as `googleSheetId`

---

## 💡 Alternative: Skip Google Sheets

If you don't want to use Google Sheets integration:

1. In `config.js`, set:
   ```javascript
   googleSheetId: ""
   ```

2. The app will work perfectly, just won't save to sheets
3. You can still collect leads via the Calendly booking

---

## 🆘 Still Having Issues?

Check the Netlify function logs:
1. Go to Netlify dashboard
2. Click **Functions**
3. Click **sheet-worker**
4. View the logs to see what error is happening

Common issues:
- **"Missing Sheet ID"**: Set `googleSheetId` in `config.js`
- **"Invalid credentials"**: Check the JSON format in environment variable
- **"Permission denied"**: Share the sheet with the service account email
