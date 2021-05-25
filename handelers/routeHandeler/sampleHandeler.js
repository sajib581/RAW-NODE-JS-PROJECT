const handeler = {};
handeler.sampleHandeler = (requestProperties, callback) => {
    callback(200, {
        message: 'This is a sample URL',
    });
};

module.exports = handeler;
