import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );
        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
        const spreadsheetId = '1av528UWJkQ01ImLluppIIsemyG6U3W_XHdtWozugfaI';

        console.log('Attempting access with OAuth2 (Refresh Token)...');
        const r = await sheets.spreadsheets.get({ spreadsheetId });
        console.log('Success with OAuth2! Title:', r.data.properties.title);
    } catch (e) {
        console.error('Failed with OAuth2:', e.message);
        if (e.response && e.response.data) {
            console.error('Details:', JSON.stringify(e.response.data, null, 2));
        }
    }
}
test();
