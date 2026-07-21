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
    const fs = require('fs');
    const dataFile = './data.json';
    const membership = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    const today = formatDate(new Date());
    // Send email reminder every 7 days   
    const nextEmailDate = addDays(membership.emailDate, 7);
    
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

    if (currentStatus === membership.status 
        &&
        today < nextEmailDate) {}
    // If membership status changed or due date, send email
    else {
        const email = require('./email.js');
        email(emailService,
            emailUser,
            emailPass,
            subject,
            text);

        // Write Persisted Membership
        membership.status = currentStatus;
        membership.emailDate = today;
        const output = JSON.stringify(membership, null, 4);
        fs.writeFileSync(dataFile, output);
    }
}

function addDays(date, days) {
    const tempDate = new Date(date);
    tempDate.setDate(tempDate.getDate() + days);
    return formatDate(tempDate);
}

function formatDate(date) {
    const tempDate = new Date(date);
    return tempDate.toISOString().split('T')[0];
}

module.exports = parseData;