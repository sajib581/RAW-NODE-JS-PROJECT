const { sampleHandeler } = require('./handelers/routeHandeler/sampleHandeler');
const { tokenHandeler } = require('./handelers/routeHandeler/tokenHandeler');
const { userHandeler } = require('./handelers/routeHandeler/userHandeler');

const routes = {
    sample: sampleHandeler,
    user: userHandeler,
    token: tokenHandeler,
};

module.exports = routes;
