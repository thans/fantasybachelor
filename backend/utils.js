exports.verifyEnvVar = function(variable) {
    if (process.env[variable] === undefined) {
        throw new Error('Please set the ' + variable + ' environment variable.');
    }
}