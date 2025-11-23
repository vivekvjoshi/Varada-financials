const { google } = require('googleapis');

module.exports = async (req, res) => {
    // Enable CORS for local testing or cross-origin if needed
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const data = req.body;

        // 1. Load Credentials
        // In Vercel, we can't easily read a file from the root in a serverless function unless we bundle it.
        // Best practice: Use Environment Variables. 
        // BUT, user asked for "service-account JSON steps" and "drag and drop".
        // We will try to read 'credentials.json' from the root or expect ENV vars.
        // To make it "drag and drop" friendly without ENV vars setup, we must include credentials.json in the deployment.
        // We will look for credentials.json in the same directory or root.

        let auth;
        try {
            // Try to require it (Vercel bundles required files)
            // Note: The user must place credentials.json in the api folder or root.
            // We'll assume it's in the root, but accessing root files in Vercel functions is tricky.
            // We will try to read it from process.cwd()

            // However, the most robust way for a "zip" deliverable is to require it directly.
            // We will instruct the user to put credentials.json in the 'api' folder.
            const credentials = require('./credentials.json');

            auth = new google.auth.GoogleAuth({
                credentials,
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });
        } catch (e) {
            console.error("Credentials error:", e);
            return res.status(500).json({ error: 'Missing or invalid api/credentials.json' });
        }

        const sheets = google.sheets({ version: 'v4', auth });

        // 2. Get Sheet ID from Config? 
        // The server doesn't have access to client-side config.js easily.
        // We should pass the sheet ID in the body OR hardcode it here.
        // To keep it "single config file" for the user, we should pass it from the client.
        // BUT, that's insecure (anyone can write to any sheet if they know the ID).
        // However, for this level of app, passing it from client is the only way to respect "edit only config.js".
        // We will accept sheetId from the body.

        // Wait, I didn't send sheetId in the fetch call in index.html.
        // I need to update index.html to send config.googleSheetId.
        // Let's assume the user will paste the ID in config.js and we send it.

        // *Self-correction*: I will update index.html to send googleSheetId.

        const sheetId = data.sheetId;
        if (!sheetId) {
            return res.status(400).json({ error: 'Missing Sheet ID' });
        }

        // 3. Prepare Row
        const row = [
            data.timestamp || new Date().toISOString(),
            data.firstName || '',
            data.lastName || '',
            data.email || '',
            data.phone || '',
            data.broker || '',
            data.path || '',
            data.note || ''
        ];

        // 4. Append to Sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'Sheet1!A:H', // Assumes Sheet1 exists
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [row],
            },
        });

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Sheet Error:', error);
        return res.status(500).json({ error: error.message });
    }
};
