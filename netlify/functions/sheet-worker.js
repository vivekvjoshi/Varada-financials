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

        // Use provided tab name or default to empty string (which implies "First Sheet" in A1 notation)
        // Wraps in single quotes to handle spaces (e.g., 'Lead Capture'!A:H)
        const prefix = data.sheetTab ? `'${data.sheetTab}'!` : '';

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

        // Only try to find and update if we have a phone number (since it's mandatory)
        if (data.phone && fullName) {
            try {
                // Read Columns B to D (Name, Email, Phone)
                // Row[0] = Name, Row[1] = Email, Row[2] = Phone
                const rangeToSearch = `${prefix}B:D`;

                const getRes = await sheets.spreadsheets.values.get({
                    spreadsheetId: sheetId,
                    range: rangeToSearch,
                });

                const rows = getRes.data.values || [];

                // Find index where Phone AND Name match
                // Phone is mandatory and unique-ish, Name confirms identity.
                const searchPhone = String(data.phone).trim();
                const searchName = fullName.toLowerCase();

                const rowIndex = rows.findIndex(r => {
                    const rowName = (r[0] || '').toLowerCase().trim();
                    const rowPhone = String(r[2] || '').trim();
                    return rowPhone === searchPhone && rowName === searchName;
                });

                if (rowIndex !== -1) {
                    // Row numbers are 1-based. rowIndex 0 is Row 1.
                    const rowNumber = rowIndex + 1;

                    // Update that specific row
                    await sheets.spreadsheets.values.update({
                        spreadsheetId: sheetId,
                        range: `${prefix}A${rowNumber}:H${rowNumber}`,
                        valueInputOption: 'USER_ENTERED',
                        requestBody: { values: [rowData] }
                    });

                    console.log(`Updated existing row ${rowNumber} for Phone: ${data.phone} & Name: ${fullName}`);
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
                range: `${prefix}A:H`,
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
