var config = require('./config/config');
var _ = require('underscore');

exports.verifyEnvVar = function() {
    var conf = config;
    _.each(arguments, function(argument) {
        conf = conf[argument];
        if (!conf) {
            throw new Error('Please set the ' + arguments.join('.') + ' environment variable.');
        }
    });
};