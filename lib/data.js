const fs = require('fs');
const path = require('path');

const lib = {};

// base directory of the data folder
lib.basedir = path.join(__dirname, '/../.data/');

// write data to FILE
lib.create = (dir, fileName, data, callback) => {
    fs.open(`${lib.basedir + dir}/${fileName}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);

            // write data to file and then close it
            console.log({ fileDescriptor });
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback(false);
                        } else {
                            callback('Error closing  the new file ');
                        }
                    });
                } else {
                    callback('Error writing to new file');
                }
            });
        } else {
            // callback(err);
            callback('There was an error! File may already exist');
        }
    });
};

lib.read = (dir, fileName, callback) => {
    fs.readFile(`${lib.basedir + dir}/${fileName}.json`, 'utf-8', (err, data) => {
        callback(err, data);
    });
};

module.exports = lib;
