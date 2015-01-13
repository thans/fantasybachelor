var Bookshelf = require('bookshelf');
var _ = require('underscore');
var utils = require('./utils');
var config = require('./config/config');
BACH_ID = 33;

module.exports.MySQL = module.exports.connection = Bookshelf.MySQL = Bookshelf.connection = Bookshelf.initialize({
    client: 'mysql',
    connection: getConnectionParams()
});

_.each(['User', 'UserScore', 'Prediction', 'Contestant', 'BioQuestion', 'BioStatistic', 'Week', 'Elimination', 'ScoringOpportunity'], function(model) {
    module.exports = _.extend(module.exports, require('./models/' + model + '.js'));
});

function getConnectionParams() {
    verifyEnv();
    return {
        database : config.DATABASE.DATABASE,
        host     : config.DATABASE.HOSTNAME,
        port     : config.DATABASE.PORT,
        user     : config.DATABASE.USERNAME,
        password : config.DATABASE.PASSWORD,
        charset  : 'utf8'

    }
}

function verifyEnv() {
    utils.verifyEnvVar('DATABASE', 'DATABASE');
    utils.verifyEnvVar('DATABASE', 'HOSTNAME');
    utils.verifyEnvVar('DATABASE', 'PORT');
    utils.verifyEnvVar('DATABASE', 'USERNAME');
    utils.verifyEnvVar('DATABASE', 'PASSWORD');
}