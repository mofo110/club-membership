# Club Membership

## Description

This is my quick and dirty node app to:

* Get a Club Membership
* Send email notification of membership OPEN or CLOSED status

> [!WARNING]
> An email reminder will be sent every 7 days.

## Requirements

* Node
* Dotenv
* Nodemailer

## References
* Node.js Send an Email [W3Schools.com](https://www.w3schools.com/nodejs/nodejs_email.asp)
* Nodemailer Well-Known Services [Nodemailer.com](https://nodemailer.com/smtp/well-known-services)
* Fix #AUTH005 Error [CDESoftware.com](https://support.cdesoftware.com/kb/a3802/fixing-the-535-5_7_0-auth005-too-many-bad-auth-attempts-error.aspx)
* Use Environment Variables [DEV.to](https://dev.to/siddharth151199/how-to-send-email-in-node-js-with-nodemailer-edb)

## Usage

### Step 1: Clone the repo and change to the working directory.

```bash
git clone https://github.com/mofo110/club-membership.git
cd club-membership
```

### Step 2: Install dependencies.
```bash
npm install
```

### Step 3: Create .env file with club hostname, email service, username and password.
```bash
# .env
CLUB_HOSTNAME=<your_club_hostname>
EMAIL_SERVICE=<your_email_service>
EMAIL_USER=<your_email_id>
EMAIL_PASS=<your_email_app_password>
```

### Step 4: Execute to get Club Membership Link.

```bash
node get-club-membership.js
◇ injected env (4) from .env // tip: ⌘ override existing { override: true }
Subject: Club Membership OPENED on 2026-07-16
Text: https://<your_club_hostname>/membership/
Email sent: 250 OK , completed
```