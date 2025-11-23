const { google } = require('googleapis');

exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const data = JSON.parse(event.body);

        // 1. Load Credentials
        let auth;
        try {
            let credentials;

            // Try environment variable first (for Netlify deployment)
            if (process.env.GOOGLE_CREDENTIALS) {
                try {
                    credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
                    console.log("Using credentials from environment variable");
                } catch (parseError) {
                    console.error("Failed to parse GOOGLE_CREDENTIALS:", parseError);
                    throw new Error("Invalid GOOGLE_CREDENTIALS format");
                }
            } else {
                // Fallback to local file (for local testing) using fs
                const fs = require('fs');
                const path = require('path');
                const credPath = path.join(__dirname, 'credentials.json');
                if (fs.existsSync(credPath)) {
                    credentials = JSON.parse(fs.readFileSync(credPath, 'utf8'));
                    console.log("Using credentials from local file");
                } else {
                    throw new Error("No credentials found. Set GOOGLE_CREDENTIALS environment variable in Netlify dashboard");
                }
            }

            auth = new google.auth.GoogleAuth({
                credentials,
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });
        } catch (e) {
            console.error("Credentials error:", e);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Missing or invalid credentials. Set GOOGLE_CREDENTIALS env var in Netlify dashboard',
                    details: e.message
                })
            };
        }

        const sheets = google.sheets({ version: 'v4', auth });

        const sheetId = data.sheetId;
        if (!sheetId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing Sheet ID' })
            };
        }

        // 3. Prepare Row - Match Google Sheets structure: Name, Email, Phone Number, Advisor Name
        const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
        const row = [
            fullName,                    // Column A: Name
            data.email || '',            // Column B: Email
            data.phone || '',            // Column C: Phone Number
            data.advisorName || ''       // Column D: Advisor Name
        ];

        // 4. Append to Sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'Lead Capture!A:D', // Updated to match sheet name and columns
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [row],
            },
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true })
        };

    } catch (error) {
        console.error('Sheet Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
