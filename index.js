// dependencies
const server = require('./lib/server');
const workers = require('./lib/worker');

// app module
const app = {};

app.init = () => {
    // start server
    server.init();
    // start workers
    workers.init();
};

app.init();

module.exports = app;
