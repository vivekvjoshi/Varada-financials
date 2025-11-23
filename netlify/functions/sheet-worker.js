const { google } = require('googleapis');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const data = JSON.parse(event.body);
        console.log('Incoming payload:', data);

        // Load credentials
        let auth;
        try {
            let credentials;
            if (process.env.GOOGLE_CREDENTIALS) {
                try {
                    credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
                    console.log('Using credentials from environment variable');
                } catch (parseError) {
                    console.error('Failed to parse GOOGLE_CREDENTIALS:', parseError);
                    throw new Error('Invalid GOOGLE_CREDENTIALS format');
                }
            } else {
                const fs = require('fs');
                const path = require('path');
                const credPath = path.join(__dirname, 'credentials.json');
                if (fs.existsSync(credPath)) {
                    credentials = JSON.parse(fs.readFileSync(credPath, 'utf8'));
                    console.log('Using credentials from local file');
                } else {
                    throw new Error('No credentials found. Set GOOGLE_CREDENTIALS environment variable in Netlify dashboard');
                }
            }

            auth = new google.auth.GoogleAuth({
                credentials,
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });
        } catch (e) {
            console.error('Credentials error:', e);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Missing or invalid credentials. Set GOOGLE_CREDENTIALS env var in Netlify dashboard',
                    details: e.message,
                }),
            };
        }

        const sheets = google.sheets({ version: 'v4', auth });

        const sheetId = data.sheetId;
        if (!sheetId) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing Sheet ID' }) };
        }

        const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
        const row = [
            fullName,
            data.email || '',
            data.phone || '',
            data.advisorName || '',
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'Lead Capture!A:D',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [row] },
        });

        return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    } catch (error) {
        console.error('Sheet Error:', error);
        console.log('Request body:', event.body);
        const errorResponse = {
            message: error.message,
            stack: error.stack ? error.stack.split('\n')[0] : undefined,
        };
        return { statusCode: 500, headers, body: JSON.stringify({ error: errorResponse }) };
    }
};
