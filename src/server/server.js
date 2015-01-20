// Express + middleware
var express = require('express');
var session = require('cookie-session')
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var compression = require('compression');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');

var path = require('path');
var config = require('./config/config');
var auth = require('./auth/auth');
var database = require('./database');

console.log('Starting app in: ' + config.NODE_ENV);

// Create app
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Configure middleware
app.use(compression());
app.use(bodyParser.json());
app.use(multer());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({ secret: config.SESSION_SECRET || 'keyboard cat' }));
app.use(auth.middleware());

// Setup static route
app.use('/' + config.PACKAGE.version, express.static(__dirname + '/../public', {maxAge: 0}));

// Setup views
app.get('/', function(req, res) {
    res.render('index', { config: config })
});
app.get('/view/:view', function(req, res) {
    res.render(req.params.view, { config: config })
});

// Setup api endpoints
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
    database.User.getLeaderboard(req.user).then(responseFunction(res)).fail(errorFunction(res));
});

// Start listening for requests
app.listen(config.PORT);
console.log('Listening on port ' + config.PORT);

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
