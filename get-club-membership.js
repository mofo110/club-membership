/**
 * Club Membership page should have a link if OPEN
 */

getClubMembership();

function getClubMembership() {
    require('dotenv').config();

    const https = require('https');

    const options = {
        hostname: process.env.CLUB_HOSTNAME,
        port: 443,
        path: '/membership/',
        method: 'GET'
    };

    const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            const parseData = require('./parse-data.js');
            parseData(data,
                process.env.EMAIL_SERVICE,
                process.env.EMAIL_USER,
                process.env.EMAIL_PASS);
        });
    });

    req.on('error', (error) => {
        console.error(error);
    });

    req.end();
}