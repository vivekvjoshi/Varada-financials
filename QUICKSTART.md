# Quick Start Guide

## ✅ YES - Deployment will start when you push to Git!

### What happens when you push:

1. **Netlify detects the push** to your repository
2. **Installs dependencies** from `package.json` (googleapis)
3. **Deploys your site** from the root directory
4. **Sets up the serverless function** in `netlify/functions/`

### ⚠️ IMPORTANT: Before you push

You have **2 options** for Google Sheets credentials:

#### Option 1: Environment Variables (RECOMMENDED ✅)
**Pros**: Secure, credentials not in Git
**Cons**: Requires one extra step in Netlify dashboard

1. **DON'T** modify `.gitignore` - keep it as is
2. Push your code to Git
3. In Netlify dashboard:
   - Go to: Site Settings → Environment Variables
   - Add variable: `GOOGLE_CREDENTIALS`
   - Value: Your entire credentials.json content (as one line)
4. Redeploy if needed

#### Option 2: Include credentials.json
**Pros**: Works immediately
**Cons**: Credentials exposed in Git (⚠️ security risk)

1. Edit `.gitignore` and remove line 4: `netlify/functions/credentials.json`
2. Replace `netlify/functions/credentials.json` with real credentials
3. Push to Git

---

## 🚀 Deployment Steps

### If using Option 1 (Environment Variables):
```bash
# 1. Commit and push (credentials.json will be ignored)
git add .
git commit -m "Deploy video advisor app"
git push origin main

# 2. Go to Netlify dashboard and add GOOGLE_CREDENTIALS env var
# 3. Done!
```

### If using Option 2 (Include credentials):
```bash
# 1. Edit .gitignore - remove the credentials.json line
# 2. Replace credentials.json with real data
# 3. Commit and push
git add .
git commit -m "Deploy video advisor app"
git push origin main

# Done!
```

---

## 📋 Current Project Status

✅ **Ready for deployment:**
- `index.html` - Main application
- `app.js` - Application logic
- `config.js` - Configuration
- `netlify.toml` - Netlify config
- `package.json` - Dependencies
- `netlify/functions/sheet-worker.js` - Serverless function (supports env vars!)
- `.gitignore` - Protects credentials
- Unit tests passing

⚠️ **Needs your attention:**
- `config.js` - Customize with your videos, Calendly link, etc.
- `netlify/functions/credentials.json` - Add real credentials OR use env var

---

## 🎯 What to customize in config.js

```javascript
videos: {
    intro: "YOUR_YOUTUBE_URL",
    recruit: "YOUR_YOUTUBE_URL", 
    sales: "YOUR_YOUTUBE_URL"
},
calendlyUrl: "YOUR_CALENDLY_LINK",
contactEmail: "YOUR_EMAIL",
googleSheetId: "YOUR_SHEET_ID", // or "" to disable
companyName: "YOUR_COMPANY_NAME"
```

---

## 🔍 How to verify it's working

After deployment:
1. Visit your Netlify URL
2. Fill out the form
3. Check your Google Sheet for the new row
4. Test the video flow

---

## 💡 Pro Tips

1. **Test locally first**: Open `index.html` in your browser
2. **Run tests**: `npm test` before pushing
3. **Use environment variables**: More secure for production
4. **Check Netlify logs**: If something fails, check the function logs

---

## 🆘 Need Help?

See `DEPLOYMENT.md` for detailed troubleshooting and setup instructions.
