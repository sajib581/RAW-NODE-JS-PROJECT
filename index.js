// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/reqResHandellers');
const environment = require('./environment');
const data = require('./lib/data');
// app module
const app = {};
// Create file system
data.create('test', 'newFile', { name: 'Bangladesh', language: 'Bangla' }, (err) => {
    console.log('Error was ', err);
});

// Read File System
data.read('test', 'newFile', (err, result) => {
    console.log(err, result);
});

// Update File System
data.update('test', 'newFile', { name: 'England', language: 'English' }, (err) => {
    console.log(err);
});

// File Delete System
data.delete('test', 'newFile', (err) => {
    console.log(err);
});
// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log('environtment variable is ', process.env.NODE_ENV);
        console.log(`App is listening on port ${environment.port}`);
    });
};
// handle request response
app.handleReqRes = handleReqRes;
// run server
app.createServer();
