const { google } = require('googleapis');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Handle variable name inconsistencies
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.ClIENT_ID; // Note the typo in user's env
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/api/auth/callback/google'; // Common default, or just use localhost

if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('Error: CLIENT_ID or CLIENT_SECRET not found in .env.local');
    console.log('Found env keys:', Object.keys(process.env).filter(k => k.includes('CLIENT')));
    process.exit(1);
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('Check your Google Cloud Console "Authorized redirect URIs".\nWhat URI did you add? (Press Enter for http://localhost:3000/api/auth/callback/google): ', (customUri) => {
    const REDIRECT_URI = customUri.trim() || 'http://localhost:3000/api/auth/callback/google';

    console.log(`\nUsing Redirect URI: ${REDIRECT_URI}\n`);

    const oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );

    const SCOPES = ['https://www.googleapis.com/auth/drive'];

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'
    });

    console.log('1. Visit this URL to authorize:', authUrl);
    console.log('2. After authorizing, you will be redirected to an error page (or your app).');
    console.log('3. Copy the code from the URL bar (everything after code=)');

    rl.question('\nEnter the code here: ', (code) => {
        rl.close();
        oauth2Client.getToken(decodeURIComponent(code), (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            console.log('\nSUCCESS! Here are your tokens:');
            console.log('-----------------------------------');
            console.log('Refresh Token:', token.refresh_token);
            console.log('-----------------------------------');
            console.log('\nPlease add this to your .env.local file as GOOGLE_REFRESH_TOKEN=...');
        });
    });
});
