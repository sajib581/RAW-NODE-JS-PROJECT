/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */

const {
 read, create, update, deletes,
} = require('../../lib/data');
const {
  hassPass,
  parseJSON,
  createRandomString,
} = require('../../utilities/utilities');

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
  let { phone, password } = requestProperties.body;
  phone = typeof phone === 'string' && phone.trim().length === 11 ? phone : false;
  password = typeof password === 'string' && password.trim().length > 0
      ? password
      : false;

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
  const id = requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;
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

handeler._token.put = (requestProperties, callback) => {
  let { id, extend } = requestProperties.body;
  id = typeof id === 'string' && id.trim().length === 20 ? id : false;
  extend = typeof extend === 'boolean' && extend ? extend : false;

  if (id && extend) {
    read('tokens', id, (err1, tokenData) => {
      if (!err1) {
        const tokenObject = parseJSON(tokenData);
        if (tokenObject.expires > Date.now()) {
          tokenObject.expires = Date.now() + 60 * 60 * 1000;
          update('tokens', id, tokenObject, (err2) => {
            if (!err2) {
              callback(200);
            } else {
              callback(500, { error: 'Server Error' });
            }
          });
        } else {
          callback(400, { error: 'Token already expired' });
        }
      } else {
        callback(400, { eror: 'Token not found' });
      }
    });
  }
};

handeler._token.delete = (requestProperties, callback) => {
  const id = requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;
  if (id) {
    read('tokens', id, (err, tokenData) => {
      if (!err && tokenData) {
        deletes('tokens', id, (err2) => {
          if (!err2) {
            callback(200, { message: 'Token deleted successfully' });
          } else {
            callback(500, { message: 'Server error' });
          }
        });
      } else {
        callback(404, { message: 'token not found' });
      }
    });
  } else {
    callback(400, { message: 'invalid type id' });
  }
};

handeler._token.verify = (id, phone, callback) => {
  read('tokens', id, (err, tokenData) => {
    if (!err && tokenData) {
      if (parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()) {
        callback(true);
      } else {
        const errHints = parseJSON(tokenData).expires < Date.now() ? 'expires' : 'phone problem';
        console.log(errHints);
        console.log("False because can't satisfy condition");
        callback(false);
      }
    } else {
      console.log("False because can't read");
      callback(false);
    }
  });
};

module.exports = handeler;
