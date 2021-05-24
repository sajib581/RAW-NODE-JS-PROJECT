const handeler = {};

handeler.notFoundHandeler = (requestProperties, callback) => {
    callback(404, {
        message: 'Your requested url not found',
    });
};

module.exports = handeler;
