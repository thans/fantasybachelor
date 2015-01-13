var nconf = require('nconf');
nconf
    .argv()
    .env()
    .file({
        file : __dirname + '/' + process.env.NODE_ENV + '.json'
    })
    .load();

module.exports = nconf.get();