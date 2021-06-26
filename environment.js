// module saffolding
const environtments = {};

environtments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'huasddfjghgsdtdgbsn',
    maxCheck: 5,
    twilio: {
        fromPhone: '+15005550006',
        accountSid: 'AC7c796d79cc31edf15cd6a7866164190a',
        authToken: 'cc76d8de7c0fe4a3d9a439db76251794',
    },
};

environtments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'jhgrtbdhrtgkjoweuiwjflk',
    maxCheck: 5,
    twilio: {
        fromPhone: '+15005550006',
        accountSid: 'AC7c796d79cc31edf15cd6a7866164190a',
        authToken: 'cc76d8de7c0fe4a3d9a439db76251794',
    },
};

// eslint-disable-next-line prettier/prettier
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';
// eslint-disable-next-line prettier/prettier
const environmentToExport = typeof environtments[currentEnvironment] === 'object'
        ? environtments[currentEnvironment]
        : environtments.staging;

module.exports = environmentToExport;
