# 🚀 Quick Deployment Guide

## Ready to Deploy? Follow These Steps:

### 1. Set Netlify Environment Variable
```
Go to: Netlify Dashboard → Your Site → Site Settings → Environment Variables
```

Add Variable:
- **Key**: GOOGLE_CREDENTIALS
- **Value**: (paste the entire JSON from credentials.json as a single line)

**The JSON to paste:**

⚠️ **IMPORTANT**: Copy the entire contents of your local `netlify/functions/credentials.json` file and paste it as a single line (remove all line breaks).

The JSON should look like this format (but with your actual credentials):
```json
{"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"...","universe_domain":"googleapis.com"}
```

### 2. Deploy Your Code
```bash
git add .
git commit -m "Add advisor dropdown and complete Google Sheets integration"
git push
```

### 3. Verify Deployment
1. Wait for Netlify to build and deploy
2. Visit your live site
3. Test the form submission
4. Check your Google Sheet for the new entry

## 📝 What's Already Configured

✅ Google Sheet ID: `1Qj8bhNSE59Y3cDGww5r1okZ3gt1sXKhxzia4eyD0Mn8`
✅ Sheet Name: "Lead Capture"
✅ Columns: Name, Email, Phone Number, Advisor Name
✅ Advisor Dropdown: 4 sample advisors included
✅ Back Buttons: All navigation steps
✅ Security: Credentials protected in .gitignore

## 🎯 Test Your Deployment

After deploying, test by:
1. Filling out the form
2. Selecting an advisor
3. Completing the flow
4. Checking if data appears in Google Sheets
5. Verifying the Calendly link uses the selected advisor's link

## 🔧 Quick Edits

### To Update Advisors:
Edit `advisors.json` and redeploy

### To Change Videos:
Edit `config.js` → `videos` section

### To Update Branding:
Edit `config.js` → `companyName`, `logoPath`, `brandColor`

## ✨ You're All Set!

Everything is configured and ready to go. Just set the environment variable and deploy!
