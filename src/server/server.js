var express = require('express');
var path = require('path');
var ejs = require('ejs');
var database = require('./database');

var app = express();

console.log('Running in: ' + process.env.NODE_ENV);

app.use(express.compress());
app.use(express.bodyParser());

var publicPath = path.resolve(__dirname + '/../public');

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render(publicPath + '/index', { title: 'The index page!' })
});

app.get('/view/:view', function(req, res) {
    res.render(publicPath + '/views/' + req.params.view, { title: 'The index page!' })
});

app.use(express.static(publicPath, {maxAge: 0}));

app.post('/loginUser', function (req, res) {
    console.log('loginUser: ' + JSON.stringify(req.body));
    database.User.login(req.body).then(responseFunction(res)).fail(errorFunction(res));
});

app.post('/setAlias', function (req, res) {
    console.log('setAlias: ' + JSON.stringify(req.body));
    database.User.setAlias(req.body.userId, req.body.alias).then(responseFunction(res)).fail(errorFunction(res));
});

app.get('/getWeeks', function (req, res) {
    console.log('getWeeks: ' + JSON.stringify(req.query));
    database.Weeks.getExtended(req.query.userId).then(responseFunction(res)).fail(errorFunction(res));
});

app.get('/getContestants', function (req, res) {
    console.log('getContestants: ' + JSON.stringify(req.body));
    database.Contestants.getAll().then(responseFunction(res)).fail(errorFunction(res));
});

app.post('/selectContestant', function(req, res) {
    console.log('selectContestant: ' + JSON.stringify(req.body));
    database.Predictions.makePrediction(req.body.userId, req.body.weekId, req.body.contestantId).then(responseFunction(res)).fail(errorFunction(res));
});

app.post('/removeContestant', function(req, res) {
    console.log('removeContestant: ' + JSON.stringify(req.body));
    database.Predictions.removePrediction(req.body.userId, req.body.weekId, req.body.contestantId).then(responseFunction(res)).fail(errorFunction(res));
});

app.get('/getStatistics', function(req, res) {
    console.log('getStatistics');
    database.Weeks.getWeeklyPredictions().then(responseFunction(res)).fail(errorFunction(res));
});

app.get('/getLeaderboard', function(req, res) {
    console.log('getLeaderboard');
    database.User.getLeaderboard().then(responseFunction(res)).fail(errorFunction(res));
    // test
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
    return process.env.PORT || 8000;
}
