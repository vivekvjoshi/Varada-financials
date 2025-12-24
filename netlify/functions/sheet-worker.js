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
                try {
                    credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
                } catch (parseError) {
                    throw new Error('Invalid GOOGLE_CREDENTIALS format');
                }
            } else {
                const fs = require('fs');
                const path = require('path');
                const credPath = path.join(__dirname, 'credentials.json');
                if (fs.existsSync(credPath)) {
                    credentials = JSON.parse(fs.readFileSync(credPath, 'utf8'));
                } else {
                    throw new Error('No credentials found.');
                }
            }

            auth = new google.auth.GoogleAuth({
                credentials,
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });
        } catch (e) {
            console.error('Credentials error:', e);
            return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
        }

        const sheets = google.sheets({ version: 'v4', auth });

        // -------------------------------------------------
        // 2️⃣ Validate required fields
        // -------------------------------------------------
        const sheetId = data.sheetId;
        if (!sheetId) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing Sheet ID' }) };

        // -------------------------------------------------
        // 3️⃣ Prepare Data
        // -------------------------------------------------
        const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
        const timestamp = data.timestamp || new Date().toISOString();
        const tabName = data.sheetTab || 'Sheet1'; // Default tab name

        // Requested Columns: Date & Time, Name, Email, Phone, Advisor Name, Feedback, Followup Date
        const rowData = [
            timestamp,               // A
            fullName,                // B
            data.email || '',        // C (Key for lookup)
            data.phone || '',        // D
            data.advisorName || '',  // E
            data.feedback || '',     // F
            data.followupDate || '', // G
            data.path || ''          // H
        ];

        // -------------------------------------------------
        // 4️⃣ Check for Existing Row (Update Logic)
        // -------------------------------------------------
        let updated = false;

        // Only try to find and update if we have an email
        if (data.email) {
            try {
                // Read Column C (Email) to find a match
                // Note: Range might need adjustment if using a different tab
                // Assumes Email is in Column C (Index 0 of the result from range C:C)
                const rangeToSearch = `${tabName}!C:C`;

                const getRes = await sheets.spreadsheets.values.get({
                    spreadsheetId: sheetId,
                    range: rangeToSearch,
                });

                const rows = getRes.data.values || [];
                // Find index where email matches
                const rowIndex = rows.findIndex(r => r[0] && r[0].toLowerCase() === data.email.toLowerCase());

                if (rowIndex !== -1) {
                    // Row numbers are 1-based. rowIndex 0 is Row 1.
                    const rowNumber = rowIndex + 1;

                    // Update that specific row
                    await sheets.spreadsheets.values.update({
                        spreadsheetId: sheetId,
                        range: `${tabName}!A${rowNumber}:H${rowNumber}`,
                        valueInputOption: 'USER_ENTERED',
                        requestBody: { values: [rowData] }
                    });

                    console.log(`Updated existing row ${rowNumber} for ${data.email}`);
                    updated = true;
                }
            } catch (err) {
                console.warn("Could not search for existing row, falling back to append.", err.message);
            }
        }

        // -------------------------------------------------
        // 5️⃣ Append if not updated
        // -------------------------------------------------
        if (!updated) {
            await sheets.spreadsheets.values.append({
                spreadsheetId: sheetId,
                range: `${tabName}!A:H`,
                valueInputOption: 'USER_ENTERED',
                requestBody: { values: [rowData] },
            });
            console.log(`Appended new row for ${data.email || 'unknown'}`);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, updated }),
        };

    } catch (error) {
        console.error('Sheet Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
