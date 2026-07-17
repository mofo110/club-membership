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
            getData(data);
        });
    });

    req.on('error', (error) => {
        console.error(error);
    });

    req.end();
}

function getData(data) {
    const regex = new RegExp(/<h1>Interested in becoming a member\?<\/h1>(.*?)<\/p>/);
    const match = regex.exec(data.replaceAll('\n', ''));

    if (match) {
        const clickHere = match[1].trim();
        getLink(clickHere);
    } else {
        console.log("No click here found.");
    }
}

function getLink(clickHere) {
    // Read Persisted Membership Dates
    const jsonfile = require('jsonfile');
    const file = './data.json';
    const membershipDates = jsonfile.readFileSync(file);
    const today = (new Date()).toISOString().split('T')[0];

    // Match for a hyperlink to open membership window
    const regex = new RegExp(/href="(.*?)"/);
    const match = regex.exec(clickHere.replaceAll('\n', ''));

    let notificationWindow = '';
    let subject = '';
    let text = '';

    // Open Membership Window
    if (match) {
        // Persist lowest date
        if (today < membershipDates.openDate) {
            membershipDates.openDate = today;
        }
        notificationWindow = 'OPEN';
        subject = 'Club Membership OPENED on ' + membershipDates.openDate;
        text = match[1].trim();
    }
    // Otherwise, Closed Membership Window
    else {
        // Persist lowest date
        if (today < membershipDates.closedDate) {
            membershipDates.closedDate = today;
        }
        notificationWindow = 'CLOSED';
        subject = 'Club Membership CLOSED on ' + membershipDates.closedDate;
        text = 'No link found.';
    }

    // Write Persisted Membership Dates
    jsonfile.writeFileSync(file, membershipDates);
    
    console.log("Subject: " + subject);
    console.log("Text: " + text);

    // If desired window, send email notification
    if (notificationWindow === process.env.NOTIFICATION_WINDOW) {
        const email = require('./email.js');
        email(process.env.EMAIL_SERVICE,
            process.env.EMAIL_USER,
            process.env.EMAIL_PASS,
            subject,
            text);    
    }
}