const { google } = require('googleapis');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    // CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Only POST allowed
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        const data = JSON.parse(event.body);
        console.log('Incoming payload:', data);

        // -------------------------------------------------
        // 1️⃣ Load Google credentials
        // -------------------------------------------------
        let auth;
        try {
            let credentials;
            if (process.env.GOOGLE_CREDENTIALS) {
                // Env‑var contains raw JSON (single line)
                try {
                    credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
                    console.log('Using credentials from environment variable');
                } catch (parseError) {
                    console.error('Failed to parse GOOGLE_CREDENTIALS:', parseError);
                    throw new Error('Invalid GOOGLE_CREDENTIALS format');
                }
            } else {
                // Local fallback (useful for dev)
                const fs = require('fs');
                const path = require('path');
                const credPath = path.join(__dirname, 'credentials.json');
                if (fs.existsSync(credPath)) {
                    credentials = JSON.parse(fs.readFileSync(credPath, 'utf8'));
                    console.log('Using credentials from local file');
                } else {
                    throw new Error(
                        'No credentials found. Set GOOGLE_CREDENTIALS environment variable in Netlify dashboard'
                    );
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

        // -------------------------------------------------
        // 2️⃣ Validate required fields
        // -------------------------------------------------
        const sheetId = data.sheetId;
        if (!sheetId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing Sheet ID' }),
            };
        }

        // -------------------------------------------------
        // 3️⃣ Build the row to insert
        // -------------------------------------------------
        const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
        const row = [
            fullName,                // Column A – Name
            data.email || '',        // Column B – Email
            data.phone || '',        // Column C – Phone
            data.advisorName || '',  // Column D – Advisor Name
        ];

        // -------------------------------------------------
        // 4️⃣ Determine the range (tab name optional)
        // -------------------------------------------------
        // If you send `sheetTab` in the request, use it; otherwise just use columns A:D on the first sheet.
        // Default to the "Lead Capture" tab if no sheetTab is supplied
        const range = data.sheetTab ? `${data.sheetTab}!A:D` : 'Lead Capture!A:D';

        // -------------------------------------------------
        // 5️⃣ Append the row
        // -------------------------------------------------
        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [row] },
        });

        // -------------------------------------------------
        // 6️⃣ Success response
        // -------------------------------------------------
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true }),
        };
    } catch (error) {
        // -------------------------------------------------
        // 7️⃣ Detailed error logging (helps debugging)
        // -------------------------------------------------
        console.error('Sheet Error:', error);
        console.log('Request body:', event.body);
        const errorResponse = {
            message: error.message,
            // Include the first line of the stack trace for brevity
            stack: error.stack ? error.stack.split('\n')[0] : undefined,
        };
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: errorResponse }),
        };
    }
};
