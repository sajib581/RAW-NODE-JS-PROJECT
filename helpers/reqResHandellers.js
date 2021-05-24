const url = require('url');
const { StringDecoder } = require('string_decoder'); // buffer => Data
const routes = require('../routes');
const { notFoundHandeler } = require('../handelers/routeHandeler/notFoundHandler');

const handeler = {};

handeler.handleReqRes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headersObject = req.headers;
    const decoder = new StringDecoder('utf-8');
    let realData = '';

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,
    };
    console.log('routes', routes);
    console.log('trimmedPath', trimmedPath);
    console.log('routes[trimmedPath]', routes[trimmedPath]);
    const choseHandeler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandeler;
    console.log(choseHandeler);

    choseHandeler(requestProperties, (statusCode, payload) => {
        // eslint-disable-next-line no-param-reassign
        statusCode = typeof statusCode === 'number' ? statusCode : 500;
        // eslint-disable-next-line no-param-reassign
        payload = typeof payload === 'object' ? payload : {};

        const payloadString = JSON.stringify(payload);
        res.writeHead(statusCode);
        res.end(payloadString);
    });

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });
    req.on('end', () => {
        realData += decoder.end();
        console.log(realData);
        res.end('Hello Boss');
    });
};

module.exports = handeler;
