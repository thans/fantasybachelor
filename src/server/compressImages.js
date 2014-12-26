// Run this file from the project root

var glob = require('glob');
var https = require('https');
var fs = require('fs-extra')
var url = require('url');

var key = 'uDI12ispkS4rp39ZFTQkMzrFEwdYAqrC';

glob('src/public/images/scaled/**/*.png', {}, function (er, files) {
    var numberOfFiles = files.length;
    var fileNumber = 1;

    var compressFile = function(inputFilePath) {
        console.log('compressing file ' + fileNumber + '/' + numberOfFiles + ' - ' + inputFilePath);
        var outputFilePath = 'src/public/images/compressed/' + inputFilePath.substring('src/public/images/scaled/'.length);
        var input = fs.createReadStream(inputFilePath);
        fs.createFileSync(outputFilePath);
        var output = fs.createWriteStream(outputFilePath);

        /* Uncomment below if you have trouble validating our SSL certificate.
         Download cacert.pem from: http://curl.haxx.se/ca/cacert.pem */
        // var boundaries = /-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----\n/g
        // var certs = fs.readFileSync(__dirname + "/cacert.pem").toString()
        // https.globalAgent.options.ca = certs.match(boundaries);

        var options = url.parse('https://api.tinypng.com/shrink');
        options.auth = 'api:' + key;
        options.method = 'POST';

        var request = https.request(options, function(response) {
            if (response.statusCode === 201) {
                /* Compression was successful, retrieve output from Location header. */
                https.get(response.headers.location, function(response) {
                    response.pipe(output);
                    if (fileNumber < files.length) {
                        fileNumber++;
                        compressFile(files[fileNumber - 1]);
                    }
                });
            } else {
                /* Something went wrong! You can parse the JSON body for details. */
                console.log('Compression failed');
            }
        });

        input.pipe(request);
    };
    compressFile(files[fileNumber - 1]);
});