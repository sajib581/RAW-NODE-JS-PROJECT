// dependencies
const http = require('http');
const { handleReqRes } = require('../helpers/reqResHandellers');
const environment = require('../environment');

// server module
const server = {};

// create server
server.createServer = () => {
    const createServerVariable = http.createServer(server.handleReqRes);
    createServerVariable.listen(environment.port, () => {
        console.log('environtment variable is ', process.env.NODE_ENV);
        console.log(`server is listening on port ${environment.port}`);
    });
};
// handle request response
server.handleReqRes = handleReqRes;
// run server
server.init = () => {
    server.createServer();
};

module.exports = server;
