# 🚀 Deployment Checklist

## Before You Deploy

### ✅ Step 1: Review Files
- [x] `index.html` - Main application
- [x] `app.js` - Application logic
- [x] `config.js` - Configuration (customize this!)
- [x] `netlify.toml` - Netlify settings
- [x] `package.json` - Dependencies
- [x] `.gitignore` - Excludes sensitive files

### ⚠️ Step 2: Handle Google Credentials

**Option A: Use Netlify Environment Variables (Recommended)**

1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add a new variable:
   - **Key**: `GOOGLE_CREDENTIALS`
   - **Value**: Paste your entire `credentials.json` content as a single-line string

3. Update `netlify/functions/sheet-worker.js` to use the environment variable (see below)

**Option B: Include credentials.json (Less Secure)**

1. Remove `netlify/functions/credentials.json` from `.gitignore`
2. Replace the placeholder content with your real credentials
3. Commit and push

⚠️ **Warning**: This exposes your credentials in your Git repository!

### ✅ Step 3: Customize Configuration

Edit `config.js`:
- [ ] Update YouTube video URLs
- [ ] Set your Calendly link
- [ ] Add your contact email
- [ ] Set your Google Sheet ID (if using sheets)
- [ ] Customize company name and branding

### ✅ Step 4: Test Locally

```bash
# Run tests
npm test

# Open index.html in browser to verify it works
```

### ✅ Step 5: Commit and Push

```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

### ✅ Step 6: Connect to Netlify

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Select your repository
5. Configure build settings:
   - **Build command**: (leave empty)
   - **Publish directory**: `.` (root)
   - **Functions directory**: `netlify/functions`
6. Click "Deploy site"

## 🔧 Using Environment Variables (Recommended)

If you chose Option A above, update `netlify/functions/sheet-worker.js`:

Replace this section (lines 34-42):
```javascript
try {
    const credentials = require('./credentials.json');
    auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
}
```

With this:
```javascript
try {
    let credentials;
    
    // Try environment variable first (for Netlify)
    if (process.env.GOOGLE_CREDENTIALS) {
        credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    } else {
        // Fallback to local file (for local testing)
        credentials = require('./credentials.json');
    }
    
    auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
}
```

## 📊 After Deployment

1. Visit your Netlify site URL
2. Test the form submission
3. Check if data appears in your Google Sheet
4. Test all video flows

## 🐛 Common Issues

### Issue: "Cannot find module 'googleapis'"
**Solution**: Netlify will install this automatically. If it fails, check that `package.json` is in the root directory.

### Issue: "Missing or invalid credentials.json"
**Solution**: 
- Make sure you've set the `GOOGLE_CREDENTIALS` environment variable in Netlify
- OR ensure `credentials.json` is deployed with your site

### Issue: Videos not playing
**Solution**: Check that your YouTube URLs in `config.js` are correct and public.

### Issue: Sheet not updating
**Solution**:
- Verify the Sheet ID in `config.js`
- Ensure the service account has edit access to the sheet
- Check Netlify function logs for errors

## 🎉 You're Ready!

Once you've completed all steps, your deployment will start automatically when you push to Git!
