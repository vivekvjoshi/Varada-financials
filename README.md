# Video Advisor - Lead Capture Application

A modern, interactive video advisor application for lead capture with Google Sheets integration.

## 🚀 Features

- **Multi-step Video Flow**: Intro video → Question → Personalized final video
- **Lead Capture Form**: Collects user information with validation
- **Google Sheets Integration**: Automatically saves leads to Google Sheets
- **Responsive Design**: Works beautifully on all devices
- **Configurable**: Easy customization via `config.js`
- **Unit Tested**: Jest tests for core functionality

## 📁 Project Structure

```
grit-financials/
├── index.html              # Main HTML file
├── app.js                  # Application logic (browser-compatible)
├── config.js               # Configuration file
├── netlify.toml            # Netlify configuration
├── package.json            # Dependencies
├── jest.config.js          # Jest configuration
├── .gitignore              # Git ignore rules
├── favicon.png             # App icon
├── hero-image.png          # Hero section image
├── netlify/
│   └── functions/
│       ├── sheet-worker.js # Netlify serverless function
│       └── credentials.json # Google Service Account credentials (DO NOT COMMIT)
└── tests/
    └── app.test.js         # Unit tests
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google Sheets (Optional)

If you want to save leads to Google Sheets:

1. Create a Google Cloud Project
2. Enable Google Sheets API
3. Create a Service Account
4. Download the credentials JSON file
5. **Replace** `netlify/functions/credentials.json` with your actual credentials
6. Share your Google Sheet with the service account email
7. Copy your Sheet ID from the URL and paste it in `config.js`

### 3. Customize Configuration

Edit `config.js` to customize:
- Video URLs (YouTube links)
- Company name and branding
- Form text and placeholders
- Calendly booking link
- Contact email

### 4. Run Tests

```bash
npm test
```

## 🌐 Deployment to Netlify

### Method 1: Drag & Drop (Easiest)

1. Build is not required - this is a static site
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag the entire `grit-financials` folder
4. Done! Your site is live

### Method 2: Git Integration (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Netlify
3. Netlify will automatically:
   - Install dependencies from `package.json`
   - Deploy the site from the root directory
   - Set up the serverless function

**Important**: Make sure `netlify/functions/credentials.json` contains your actual Google credentials before deploying.

## 📝 Configuration Guide

### `config.js` Options

```javascript
{
  videos: {
    intro: "YouTube URL",      // First video shown
    recruit: "YouTube URL",    // Video for option A
    sales: "YouTube URL"       // Video for option B
  },
  calendlyUrl: "Your Calendly link",
  contactEmail: "your@email.com",
  googleSheetId: "Your Sheet ID or empty string",
  companyName: "Your Company",
  logoPath: "./favicon.png",
  brandColor: "#3b82f6",
  texts: { /* All UI text */ },
  placeholders: { /* Form placeholders */ }
}
```

## 🧪 Testing

Unit tests cover:
- ✅ YouTube URL parsing
- ✅ Step navigation logic
- ✅ User data handling

Run tests with:
```bash
npm test
```

## 🔒 Security Notes

1. **Never commit** `netlify/functions/credentials.json` with real credentials
2. The `.gitignore` file excludes this automatically
3. For production, consider using Netlify Environment Variables instead

## 📦 Dependencies

### Production
- `googleapis` - Google Sheets API integration

### Development
- `jest` - Testing framework
- `jest-environment-jsdom` - DOM testing environment

## 🎨 Customization

### Changing Colors
Edit CSS variables in `index.html`:
```css
:root {
  --brand-color: #2563eb;
  --brand-dark: #1e40af;
}
```

### Changing Images
Replace:
- `favicon.png` - Logo/favicon
- `hero-image.png` - Hero section background

## 📊 Google Sheets Format

The function saves data in this format:
| Timestamp | First Name | Last Name | Email | Phone | Broker | Path | Note |
|-----------|------------|-----------|-------|-------|--------|------|------|

## 🐛 Troubleshooting

### "Cannot find module 'googleapis'" error
- Run `npm install` to install dependencies
- Netlify will do this automatically on deployment

### Google Sheets not saving
- Check that `credentials.json` has valid credentials
- Verify the Sheet ID in `config.js`
- Ensure the service account has edit access to the sheet

### Tests failing
- Run `npm install` to ensure all dev dependencies are installed
- Check that `jest.config.js` exists

## 📄 License

This project is for internal use.

## 🤝 Support

For issues or questions, contact the development team.
