var express = require('express');
var database = require('./database');

var app = express();

console.log('Running in: ' + process.env.NODE_ENV);

app.use(database.getExpressConnection());

// Allow requests from another domain
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? 'http://www.fantasybach.com' : 'http://localhost:8888');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    next();
});

app.use(express.bodyParser());

app.get('/numUsers', function (req, res) {
    req.models.user.count({}, function(err, count) {
        if (err) throw err;
        res.send('Number of users: ' + count);
    });
});

app.post('/loginUser', function (req, res) {
    req.models.user.login(req.body, function(user) {
        res.send(user);
    });
});

app.get('/getWeeks', function (req, res) {
    req.models.week.getWeeks(req.query.userId, function(data) {
        res.send(data);
    });
});

app.get('/getContestants', function (req, res) {
    req.models.contestant.getContestantData(req.body, function(data) {
        console.log('WeekData: ' + JSON.stringify(data));
        res.send(data);
    });
});

app.post('/selectContestant', function(req, res) {
    console.log('selectContestant: ' + JSON.stringify(req.body));
    req.models.contestant.selectContestant(req.query.userId, req.query.weekId, req.query.contestantId, function(data) {
        res.send(data);
    });
});

app.post('/removeContestant', function(req, res) {
    console.log('removeContestant: ' + JSON.stringify(req.body));
    req.models.contestant.remove(req.query.userId, req.query.weekId, req.query.contestantId, function(data) {
        res.send(data);
    });
});

app.listen(getPort());
console.log('Listening on port ' + getPort());

function getPort() {
    return process.env.NODE_ENV === 'production' ? 80 : 8000;
}
