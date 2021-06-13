/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */

const {
    read, create,
   } = require('../../lib/data');
   const { hassPass, parseJSON, createRandomString } = require('../../utilities/utilities');

   const handeler = {};
   handeler.tokenHandeler = (requestProperties, callback) => {
       const acceeptedMethod = ['post', 'get', 'put', 'delete'];
       if (acceeptedMethod.indexOf(requestProperties.method) > -1) {
           handeler._token[requestProperties.method](requestProperties, callback);
       } else {
           callback(405);
       }
   };

   handeler._token = {};

   handeler._token.post = (requestProperties, callback) => {
    let {
        phone, password,
       } = requestProperties.body;
    phone = typeof phone === 'string' && phone.trim().length === 11 ? phone : false;
    password = typeof password === 'string' && password.trim().length > 0 ? password : false;

    if (phone && password) {
        read('users', phone, (err1, userData) => {
            const hashedPassword = hassPass(password);
            if (hashedPassword === parseJSON(userData).password) {
                const tokenId = createRandomString(20);
                const expires = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    phone,
                    id: tokenId,
                    expires,
                };
                create('tokens', tokenId, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200, tokenObject);
                    } else {
                        callback(500, { message: 'There was a problem in server' });
                    }
                });
            } else {
                callback(400, { error: 'Password is not valid' });
            }
        });
    } else {
        callback(400, { error: 'you have a problem in your request' });
 }
   };

   handeler._token.get = (requestProperties, callback) => {
    const id = requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;
    if (id) {
        read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                const user = { ...parseJSON(tokenData) };
                callback(200, user);
            } else {
        callback('400', { message: 'Requested token does not exist' });
            }
        });
    } else {
        callback('400', { message: 'Requested token does not exist' });
    }
   };

//    // @TODO: Authentication
//    handeler._token.put = (requestProperties, callback) => {

//    };

//    // @TODO Authentication
//    handeler._token.delete = (requestProperties, callback) => {
//    };

   module.exports = handeler;
