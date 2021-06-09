/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */

const {
 read, create, update, deletes,
} = require('../../lib/data');
const { hassPass, parseJSON } = require('../../utilities/utilities');

const handeler = {};
handeler.userHandeler = (requestProperties, callback) => {
    const acceeptedMethod = ['post', 'get', 'put', 'delete'];
    if (acceeptedMethod.indexOf(requestProperties.method) > -1) {
        handeler._user[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handeler._user = {};

handeler._user.post = (requestProperties, callback) => {
let {
 firstName, lastName, phone, password, tosAgreement,
} = requestProperties.body;
    firstName = typeof firstName === 'string' && firstName.trim().length > 0 ? firstName : false;
    lastName = typeof lastName === 'string' && lastName.trim().length > 0 ? lastName : false;
    phone = typeof phone === 'string' && phone.trim().length === 11 ? phone : false;
    password = typeof password === 'string' && password.trim().length > 0 ? password : false;
    tosAgreement = typeof tosAgreement === 'boolean' && tosAgreement ? tosAgreement : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        read('users', 'phone', (err1) => {
            if (err1) {
                const userObject = {
                                firstName,
                                lastName,
                                phone,
                                password: hassPass(password),
                                tosAgreement,
                            };
                            create('users', phone, userObject, (err2) => {
                                if (!err2) {
                                    callback(200, { message: 'User created Successsfully' });
                                } else {
                                    callback(500, { message: 'could not create user' });
                                }
                            });
            } else {
                callback(500, { message: 'Server Errror ccured' });
            }
        });
    } else {
        callback('400', { message: 'USER input Problem' });
    }
};

handeler._user.get = (requestProperties, callback) => {
    const phone = requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
    if (phone) {
        read('users', phone, (err, u) => {
            const user = { ...parseJSON(u) };
            if (!err) {
                delete user.password;
                callback(200, user);
            } else {
        callback('500', { message: 'Server Errror' });
            }
        });
    } else {
        callback('404', { message: 'Requested User does not exist' });
    }
};

handeler._user.put = (requestProperties, callback) => {
    let {
        firstName, lastName, phone, password,
       } = requestProperties.body;
           firstName = typeof firstName === 'string' && firstName.trim().length > 0 ? firstName : false;
           lastName = typeof lastName === 'string' && lastName.trim().length > 0 ? lastName : false;
           phone = typeof phone === 'string' && phone.trim().length === 11 ? phone : false;
           password = typeof password === 'string' && password.trim().length > 0 ? password : false;

           if (phone) {
                if (firstName || lastName || password) {
                    read('users', phone, (err1, data) => {
                        const userData = { ...parseJSON(data) };
                        if (!err1 && userData) {
                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.lastName = lastName;
                            }
                            if (password) {
                                userData.password = hassPass(password);
                            }
                            update('users', phone, userData, (err2) => {
                                if (!err2) {
                                    callback(200, { message: 'user updated successfully' });
                                } else {
                                    callback(500, { message: 'Server Error occurred' });
                                }
                            });
                        } else {
                            callback(404, { message: 'File not found' });
                        }
                    });
                } else {
                    callback(404, { message: 'Null Input ' });
                }
           } else {
               callback(404, 'phone number syntex error');
           }
};

handeler._user.delete = (requestProperties, callback) => {
    const phone = requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
       if (phone) {
        read('users', phone, (err, userData) => {
            if (!err && userData) {
                deletes('users', phone, (err2) => {
                    if (!err2) {
                        callback(200, { message: 'User deleted successfully' });
                    } else {
                        callback(500, { message: 'Server error' });
                    }
                });
            } else {
                callback(500, { message: 'Server error' });
            }
        });
       } else {
           callback(404, { message: 'invalid request' });
       }
};

module.exports = handeler;
