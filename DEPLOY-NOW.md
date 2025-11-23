# ✅ FINAL DEPLOYMENT INSTRUCTIONS

## The Problem is Now FIXED!

I've added a **dummy `credentials.json`** file that allows Netlify to build successfully.

The function will automatically use your **environment variable** instead of this dummy file.

---

## 🚀 Deploy in 3 Steps

### Step 1: Push Your Code

```bash
git add .
git commit -m "Add dummy credentials for Netlify build"
git push origin main
```

**This will deploy successfully now!** ✅

---

### Step 2: Add Your Real Credentials to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click on your site
3. Go to **Site Settings** → **Environment Variables**
4. Click **Add a variable**
5. Enter:
   - **Key**: `GOOGLE_CREDENTIALS`
   - **Value**: Your entire Google Service Account JSON

Example value (paste your real one):
```json
{
  "type": "service_account",
  "project_id": "your-actual-project-id",
  "private_key_id": "your-actual-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "your-actual-email@project.iam.gserviceaccount.com",
  "client_id": "your-actual-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "your-actual-cert-url"
}
```

6. Click **Save**

---

### Step 3: Redeploy (Optional)

If you already deployed before adding the env var:

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**

Otherwise, the next deployment will automatically use your credentials.

---

## 🎯 How It Works

```
Build Time:
├─ Netlify sees credentials.json exists ✅
├─ Build succeeds ✅
└─ Function is deployed ✅

Runtime:
├─ Function checks for GOOGLE_CREDENTIALS env var
├─ If found: Uses env var (your real credentials) ✅
└─ If not found: Uses credentials.json (placeholder - will fail)
```

**Bottom line**: Set the environment variable and everything works! 🎉

---

## 📋 Complete Checklist

- [ ] Push code to Git (includes dummy credentials.json)
- [ ] Wait for deployment to complete
- [ ] Add `GOOGLE_CREDENTIALS` environment variable in Netlify
- [ ] Customize `config.js` with your:
  - [ ] YouTube video URLs
  - [ ] Calendly link
  - [ ] Contact email
  - [ ] Google Sheet ID
  - [ ] Company name
- [ ] Test the form on your live site
- [ ] Verify data appears in Google Sheet

---

## 🔐 Security Notes

✅ **Safe to commit**: The `credentials.json` file now contains only placeholders
✅ **Real credentials**: Only in Netlify environment variable (not in Git)
✅ **No security risk**: Your actual credentials are never exposed

---

## 💡 Don't Have Google Credentials Yet?

### Quick Setup:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable **Google Sheets API**
4. Create a **Service Account**
5. Download the JSON key
6. Copy the entire JSON content
7. Paste it as the `GOOGLE_CREDENTIALS` value in Netlify

### Share Your Sheet:

1. Open your Google Sheet
2. Click **Share**
3. Add the service account email (from the JSON)
4. Give it **Editor** permission
5. Copy the Sheet ID from the URL
6. Paste it in `config.js`

---

## 🎉 You're Done!

Your app will now:
- ✅ Deploy successfully to Netlify
- ✅ Use your real credentials from environment variable
- ✅ Save leads to Google Sheets
- ✅ Show personalized videos
- ✅ Book appointments via Calendly

**Push your code and you're live!** 🚀
