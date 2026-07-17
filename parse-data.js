/**
 * Parse Club Membership Data Page
 */

function parseData(data, emailService, emailUser, emailPass) {
    const regex = new RegExp(/<h1>Interested in becoming a member\?<\/h1>(.*?)<\/p>/);
    const match = regex.exec(data.replaceAll('\n', ''));

    if (match) {
        const clickHere = match[1].trim();
        parseLink(clickHere, emailService, emailUser, emailPass);
    } else {
        console.log("No click here found.");
    }
}

function parseLink(clickHere, emailService, emailUser, emailPass) {
    // Read Persisted Membership Dates
    const jsonfile = require('jsonfile');
    const file = './data.json';
    const membership = jsonfile.readFileSync(file);
    const today = (new Date()).toISOString().split('T')[0];

    // Match for a hyperlink to open membership window
    const regex = new RegExp(/href="(.*?)"/);
    const match = regex.exec(clickHere.replaceAll('\n', ''));

    let currentStatus = '';
    let subject = '';
    let text = '';

    // Open Membership Window Link Found
    if (match) {
        // Persist lowest date
        if (today < membership.openDate) {
            membership.openDate = today;
        }
        currentStatus = 'OPEN';
        subject = 'Club Membership OPENED on ' + membership.openDate;
        text = match[1].trim();
    }
    // Otherwise, Closed Membership Window
    else {
        // Persist lowest date
        if (today < membership.closedDate) {
            membership.closedDate = today;
        }
        currentStatus = 'CLOSED';
        subject = 'Club Membership CLOSED on ' + membership.closedDate;
        text = 'No link found.';
    }
    
    console.log("Subject: " + subject);
    console.log("Text: " + text);

    // If membership status changed, send email notification
    if (currentStatus === membership.status) {}
    else {
        const email = require('./email.js');
        email(emailService,
            emailUser,
            emailPass,
            subject,
            text);

        // Write Persisted Membership
        membership.status = currentStatus;
        jsonfile.writeFileSync(file, membership);
    }
}

module.exports = parseData;