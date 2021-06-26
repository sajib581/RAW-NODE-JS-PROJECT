/* eslint-disable prettier/prettier */
// dependencies
const https = require('https');
const queryString = require('querystring');
const { twilio } = require('../environment');
// module saffolding
const notification = {};

// send  sms to user using twilo api
notification.sendTwilioSms = (phone, msg, callback) => {
    const userMsg = typeof msg === 'string' && msg.trim().length <= 1600 ? msg.trim() : false;
    const userPhone = typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false;

    if (userPhone && userMsg) {
        const payload = {
            From: twilio.fromPhone,
            To: `+88${userPhone}`,
            Body: userMsg,
        };
        const stringifyPayload = queryString.stringify(payload);
        const requestDetails = {
            hostname: 'api.twilio.com',
            mathod: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };
        const req = https.request(requestDetails, (res) => {
            const status = res.statusCode;
            console.log(status);
            if (status === 200 || status === 201) {
                callback(false);
            } else {
                callback(`Status Code returned was ${status}`);
            }
        });
        req.on('error', (err) => {
            console.log(err);
            callback(err);
        });
        req.write(stringifyPayload);
        req.end();
    } else {
        callback('Given parameter are missing or invalid');
    }
};

module.exports = notification;
