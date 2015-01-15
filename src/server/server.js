var express = require('express');
var path = require('path');
var ejs = require('ejs');
global.passport = require('passport');
var config = require('./config/config');
var auth = require('./auth/auth');

var database = require('./database');

global.app = express();

console.log('Running in: ' + config.NODE_ENV);

app.use(express.compress());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: config.SESSION_SECRET || 'keyboard cat' }));

auth.init();

var publicPath = path.resolve(__dirname + '/../public');
var viewPath = path.resolve(__dirname + '/views');

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render(viewPath + '/index', { config: config })
});

app.get('/view/:view', function(req, res) {
    res.render(viewPath + '/' + req.params.view, { config: config })
});

app.use('/' + config.PACKAGE.version, express.static(publicPath, {maxAge: 0}));

app.get('/getUser', auth.isAuthenticated, function (req, res) {
    console.log('getUser: ' + JSON.stringify(req.body));
    res.send(req.user);
});

app.post('/setAlias', auth.isAuthenticated, function (req, res) {
    console.log('setAlias: ' + JSON.stringify(req.body));
    database.User.setAlias(req.user, req.body.alias).then(responseFunction(res)).fail(errorFunction(res));
});

app.get('/getWeeks', auth.isAuthenticated, function (req, res) {
    console.log('getWeeks: ' + JSON.stringify(req.query));
    database.Weeks.getExtended(req.user).then(responseFunction(res)).fail(errorFunction(res));
});

app.get('/getContestants', auth.isAuthenticated, function (req, res) {
    console.log('getContestants: ' + JSON.stringify(req.body));
    database.Contestants.getAll().then(responseFunction(res)).fail(errorFunction(res));
});

app.post('/selectContestant', auth.isAuthenticated, function(req, res) {
    console.log('selectContestant: ' + JSON.stringify(req.body));
    database.Predictions.makePrediction(req.user, req.body.weekId, req.body.contestantId).then(responseFunction(res)).fail(errorFunction(res));
});

app.post('/removeContestant', auth.isAuthenticated, function(req, res) {
    console.log('removeContestant: ' + JSON.stringify(req.body));
    database.Predictions.removePrediction(req.user, req.body.weekId, req.body.contestantId).then(responseFunction(res)).fail(errorFunction(res));
});

app.get('/getStatistics', auth.isAuthenticated, function(req, res) {
    console.log('getStatistics');
    database.Weeks.getWeeklyPredictions().then(responseFunction(res)).fail(errorFunction(res));
});

app.get('/getLeaderboard', auth.isAuthenticated, function(req, res) {
    console.log('getLeaderboard');
    database.User.getLeaderboard().then(responseFunction(res)).fail(errorFunction(res));
});

// Start listening for requests
app.listen(getPort());
console.log('Listening on port ' + getPort());

function responseFunction(res) {
    return function(data) {
        res.send(data);
    }
}

function errorFunction(res) {
    return function(err) {
        console.log(err);
        res && res.send('Something went wrong:\n' + err, 500);
    }
}

function getPort() {
    return config.PORT || 8000;
}
