var through = require('through2');
var AWS = require('aws-sdk');

module.exports = function(options) {
    var files = [];
    return through.obj(function(file, encoding, callback) {
        if (!file.contents) {
            return callback();
        }

        var fullPath = (options.baseUrl || '') + '/' + file.relative;
        files.push(fullPath);
        callback();
    }, function(callback) {
        console.log('Invalidating the following files in CloudFront: ' + files);
        AWS.config.update({ region : options.region });
        var cloudfront = new AWS.CloudFront();
        cloudfront.createInvalidation({
            DistributionId : options.distributionId,
            InvalidationBatch : {
                CallerReference : '' + Date.now(),
                Paths : {
                    Quantity : files.length,
                    Items : files
                }
            }
        }, callback());
    });
};