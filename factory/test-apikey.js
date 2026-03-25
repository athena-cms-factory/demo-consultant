import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const sheets = google.sheets({ version: 'v4', auth: process.env.GEMINI_API_KEY });
const spreadsheetId = '1av528UWJkQ01ImLluppIIsemyG6U3W_XHdtWozugfaI';

async function test() {
    try {
        console.log('Attempting access with API Key...');
        const r = await sheets.spreadsheets.get({ spreadsheetId });
        console.log('Success with API Key! Title:', r.data.properties.title);
    } catch (e) {
        console.error('Failed with API Key:', e.message);
        if (e.response && e.response.data) {
            console.error('Details:', JSON.stringify(e.response.data, null, 2));
        }
    }
}
test();
