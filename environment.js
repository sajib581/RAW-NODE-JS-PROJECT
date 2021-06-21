// module saffolding
const environtments = {};

environtments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'huasddfjghgsdtdgbsn',
    maxCheck: 5,
};

environtments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'jhgrtbdhrtgkjoweuiwjflk',
    maxCheck: 5,
};

// eslint-disable-next-line prettier/prettier
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';
// eslint-disable-next-line prettier/prettier
const environmentToExport = typeof environtments[currentEnvironment] === 'object'
        ? environtments[currentEnvironment]
        : environtments.staging;

module.exports = environmentToExport;
