var Bookshelf = require('bookshelf');
var _ = require('underscore');
var utils = require('./utils');
BACH_ID = 15;

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
        database : process.env.RDS_DATABASE,
        host     : process.env.RDS_HOSTNAME,
        port     : process.env.RDS_PORT,
        user     : process.env.RDS_USERNAME,
        password : process.env.RDS_PASSWORD,
        charset  : 'utf8'
    }
}

function verifyEnv() {
    utils.verifyEnvVar('RDS_DATABASE');
    utils.verifyEnvVar('RDS_HOSTNAME');
    utils.verifyEnvVar('RDS_PORT');
    utils.verifyEnvVar('RDS_USERNAME');
    utils.verifyEnvVar('RDS_PASSWORD');
}
