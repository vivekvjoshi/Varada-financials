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
        // For Netlify, we can bundle credentials.json if it's in the function folder or use ENV vars.
        // Since the user wants "drag and drop" with a zip, we'll look for credentials.json in the same directory.
        // Note: In Netlify functions, __dirname might behave differently, but requiring a local file usually works if bundled.

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
                // Fallback to local file (for local testing)
                credentials = require('./credentials.json');
                console.log("Using credentials from local file");
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
                    error: 'Missing or invalid credentials. Set GOOGLE_CREDENTIALS env var or add netlify/functions/credentials.json',
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
