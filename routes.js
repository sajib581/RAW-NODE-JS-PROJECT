const { sampleHandeler } = require('./handelers/routeHandeler/sampleHandeler');
const { userHandeler } = require('./handelers/routeHandeler/userHandeler');

const routes = {
    sample: sampleHandeler,
    user: userHandeler,
};

module.exports = routes;
