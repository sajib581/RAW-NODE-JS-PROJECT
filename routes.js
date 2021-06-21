const { sampleHandeler } = require('./handelers/routeHandeler/sampleHandeler');
const { tokenHandeler } = require('./handelers/routeHandeler/tokenHandeler');
const { userHandeler } = require('./handelers/routeHandeler/userHandeler');

const { checkHandeler } = require('./handelers/routeHandeler/checkHandeler');

const routes = {
    sample: sampleHandeler,
    user: userHandeler,
    token: tokenHandeler,
    check: checkHandeler,
};

module.exports = routes;
