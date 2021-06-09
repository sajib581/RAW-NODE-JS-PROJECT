const crypto = require('crypto');
const environment = require('../environment');

const utilities = {};

// string to json
utilities.parseJSON = (string) => {
    let output;
    try {
        output = JSON.parse(string);
    } catch (error) {
        output = {};
    }
    return output;
};

utilities.hassPass = (str) => {
    if (typeof str === 'string') {
        const hash = crypto.createHmac('sha256', environment.secretKey).update(str).digest('hex');
        return hash;
    }
    return false;
};
module.exports = utilities;
