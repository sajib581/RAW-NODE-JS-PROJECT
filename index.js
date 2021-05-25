// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/reqResHandellers');
// app module
const app = {};
// port
app.config = {
    port: 3000,
};
// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`App is listening on port ${app.config.port}`);
    });
};
// handle request response
app.handleReqRes = handleReqRes;
// run server
app.createServer();
