var through = require('through2');
var mime = require('mime-types');
var AWS = require('aws-sdk');

module.exports = function(options) {
    return through.obj(function(file, encoding, callback) {
        if (!file.contents) {
            return callback();
        }
        AWS.config.update({ region : options.region });
        var s3 = new AWS.S3();

        var fullPath = options.bucket + (options.baseUrl || '') + '/' + file.relative;
        var fullPathParts = fullPath.split('/');
        var key = fullPathParts.pop();
        var bucket = fullPathParts.join('/');

        console.log('Uploading file to ' + bucket + '/' + key );
        s3.putObject({
            Bucket : bucket,
            Key : key,
            Body : file.contents,
            ContentType : mime.lookup(key)
        }, callback);
    });
};