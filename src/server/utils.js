var config = require('./config/config');
var _ = require('underscore');

exports.verifyEnvVar = function() {
    var conf = config;
    var args = arguments;
    _.each(args, function(arg) {
        conf = conf[arg];
        if (!conf) {
            throw new Error('Please set the ' + args.join('.') + ' environment variable.');
        }
    });
};