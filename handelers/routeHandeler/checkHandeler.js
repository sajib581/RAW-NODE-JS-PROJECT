/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */

const {
  read, create, update, deletes,
 } = require('../../lib/data');
 const tokenHandeler = require('./tokenHandeler');
 const { parseJSON, createRandomString } = require('../../utilities/utilities');
const { maxCheck } = require('../../environment');

 const handeler = {};
 handeler.checkHandeler = (requestProperties, callback) => {
   const acceeptedMethod = ['post', 'get', 'put', 'delete'];
   if (acceeptedMethod.indexOf(requestProperties.method) > -1) {
     handeler._check[requestProperties.method](requestProperties, callback);
   } else {
     callback(405);
   }
 };

 handeler._check = {};

 handeler._check.post = (requestProperties, callback) => {
  // validate inputs
  const protocol = typeof requestProperties.body.protocol === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;
  const url = typeof requestProperties.body.url === 'string' && requestProperties.body.url.length > 0 ? requestProperties.body.url : false;
 const method = typeof requestProperties.body.method === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;
 const successCode = typeof requestProperties.body.successCode === 'object' && requestProperties.body.successCode instanceof Array ? requestProperties.body.successCode : false;
 const timeOutSeconds = typeof requestProperties.body.timeOutSeconds === 'number' && requestProperties.body.timeOutSeconds % 1 === 0 ? requestProperties.body.timeOutSeconds && requestProperties.body.timeOutSeconds >= 1 && requestProperties.body.timeOutSeconds <= 5 : false;

 if (protocol && url && method && successCode && timeOutSeconds) {
  // verify token
  const token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false;
  // lookup the user phone by using token
  read('tokens', token, (err1, tokenData) => {
    if (!err1 && tokenData) {
      const userPhone = parseJSON(tokenData).phone;
      // lookup the user data
      read('users', userPhone, (err2, userData) => {
        if (!err2 && userData) {
          tokenHandeler._token.verify(token, userPhone, (tokenIsValid) => {
            if (tokenIsValid) {
              const userObject = parseJSON(userData);
              const userCheck = typeof userObject.checks === 'object' && userObject.checks instanceof Array ? userObject.checks : [];
              console.log(userObject.checks);
              console.log();
              console.log(userCheck);
              if (userCheck.length < maxCheck) {
                const checkedId = createRandomString(20);
                const checkedObject = {
                  id: checkedId,
                  userPhone,
                  protocol,
                  url,
                  method,
                  successCode,
                  timeOutSeconds,
                };
                // save the object
                create('check', checkedId, checkedObject, (err3) => {
                  if (!err3) {
                    // add check id to the user's object
                    userObject.checks = userCheck;
                    userObject.checks.push(checkedId);

                    // save the new user data
                    update('users', userPhone, userObject, (err4) => {
                      if (!err4) {
                        // return the data about the new check
                        callback(200, checkedObject);
                      } else {
                        callback(500, {
                          error: 'There was a problem in the server side',
                        });
                      }
                    });
                  } else {
                    callback(500, { error: 'There was a problem in server side' });
                  }
                });
              } else {
                callback(403, { error: 'User has reached maximum checked list' });
              }
            } else {
              callback(403, { error: 'Authentication Problem' });
            }
          });
        } else {
          callback(403, { error: 'User not found' });
        }
      });
    }
  });
 } else {
   callback(403, { error: 'Invalid Request' });
 }
};

 handeler._check.get = (requestProperties, callback) => {
  const id = requestProperties.queryStringObject.id.trim().length === 20
  ? requestProperties.queryStringObject.id
  : false;
if (id) {
// lookup the check
read('check', id, (err, checkData) => {
  if (!err && checkData) {
    const token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false;

    tokenHandeler._token.verify(token, parseJSON(checkData).userPhone, (tokenIsValid) => {
      if (tokenIsValid) {
        callback(200, parseJSON(checkData));
      } else {
        callback(403, { error: 'Authentication Problem' });
      }
    });
  } else {
    callback(500, { error: 'you have a problem in your request.' });
  }
});
} else {
  callback(400, { error: 'you have a problem in your request.' });
}
 };

 handeler._check.put = (requestProperties, callback) => {
  const id = typeof requestProperties.body.id === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;

  // validate ID
  const protocol = typeof requestProperties.body.protocol === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;
  const url = typeof requestProperties.body.url === 'string' && requestProperties.body.url.length > 0 ? requestProperties.body.url : false;
 const method = typeof requestProperties.body.method === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;
 const successCode = typeof requestProperties.body.successCode === 'object' && requestProperties.body.successCode instanceof Array ? requestProperties.body.successCode : false;
 const timeOutSeconds = typeof requestProperties.body.timeOutSeconds === 'number' && requestProperties.body.timeOutSeconds % 1 === 0 ? requestProperties.body.timeOutSeconds && requestProperties.body.timeOutSeconds >= 1 && requestProperties.body.timeOutSeconds <= 5 : false;

if (id) {
  if (protocol || url || method || successCode || timeOutSeconds) {
    read('check', id, (err1, checkData) => {
      if (!err1 && checkData) {
        const checkObject = parseJSON(checkData);
        const token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false;
        tokenHandeler._token.verify(token, checkObject.userPhone, (tokenIsValid) => {
          if (tokenIsValid) {
            if (protocol) {
              checkObject.protocol = protocol;
            }
            if (url) {
              checkObject.url = url;
            }
            if (method) {
              checkObject.method = method;
            }
            if (successCode) {
              checkObject.successCode = successCode;
            }
            if (timeOutSeconds) {
              checkObject.timeOutSeconds = timeOutSeconds;
            }
            update('check', id, checkObject, (err2) => {
              if (!err2) {
                callback(200);
              } else {
                callback(500, { error: 'Server Error' });
              }
            });
          } else {
            callback(403, { error: 'Authentication Problem' });
          }
        });
      }
    });
  } else {
    callback(400, { error: 'You must provide at least one field' });
  }
} else {
  callback(400, { error: 'You have a problem in your request.' });
}
 };

 handeler._check.delete = (requestProperties, callback) => {
  const id = requestProperties.queryStringObject.id.trim().length === 20
  ? requestProperties.queryStringObject.id
  : false;
if (id) {
// lookup the check
read('check', id, (err1, checkData) => {
  if (!err1 && checkData) {
    const token = typeof requestProperties.headersObject.token === 'string' ? requestProperties.headersObject.token : false;

    tokenHandeler._token.verify(token, parseJSON(checkData).userPhone, (tokenIsValid) => {
      if (tokenIsValid) {
        deletes('check', id, (err2) => {
          if (!err2) {
            read('users', parseJSON(checkData).userPhone, (err3, userData) => {
              const userObject = parseJSON(userData);
              if (!err3 && userData) {
                const userCheck = typeof userObject.checks === 'object' && userObject.checks instanceof Array ? userObject.checks : [];
                // remove the deleted check id from user's list of check
                const checkPosition = userCheck.indexOf(id);
                if (checkPosition > -1) {
                  userCheck.splice(checkPosition, 1);
                  // resave the user data
                  userObject.checks = userCheck;
                  update('users', userObject.phone, userObject, (err4) => {
                    if (!err4) {
                      callback(200);
                    } else {
                      callback(500, { error: 'Server Problem' });
                    }
                  });
                }
              }
            });
          } else {
            callback(500, { error: 'server cant delete your check token ' });
          }
        });
      } else {
        callback(403, { error: 'Authentication Problem' });
      }
    });
  } else {
    callback(500, { error: 'you have a problem in your request.' });
  }
});
} else {
  callback(400, { error: 'ID is not a valid' });
}
 };

 module.exports = handeler;
