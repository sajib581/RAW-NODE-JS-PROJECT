/* eslint-disable comma-dangle */
/* eslint-disable no-plusplus */
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

utilities.createRandomString = (strLength) => {
    let length = strLength;
    length = typeof length === 'number' && length > 0 ? length : false;
    if (length) {
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let output = '';
        for (let i = 0; i < length; i++) {
            const randomCharacter = possibleCharacters.charAt(
                Math.floor(Math.random() * possibleCharacters.length)
            );
            output += randomCharacter;
        }
        return output;
    }
    return false;
};

utilities.hassPass = (str) => {
    if (typeof str === 'string') {
        const hash = crypto.createHmac('sha256', environment.secretKey).update(str).digest('hex');
        return hash;
    }
    return false;
};
module.exports = utilities;
