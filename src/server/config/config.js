var fs = require('fs');
var nconf = require('nconf');
nconf
    .argv()
    .env()
    .file(__dirname + '/' + process.env.NODE_ENV + '.json')
    .file('resources', __dirname + '/resources.json')
    .load();

// console.log(nconf.get());

module.exports = nconf.get();

module.exports.PACKAGE = JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8'));