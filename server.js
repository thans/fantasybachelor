var express = require('express');
var database = require('./database');

var app = express();

console.log('Running in: ' + process.env.NODE_ENV);

app.use(express.compress());
app.use(database.getExpressConnection());
app.use(express.bodyParser());

app.use('/js', express.static('public/js'));
app.use('/css', express.static('public/css'));
app.use('/images', express.static('public/images'));

app.get('/', function(req, res) {
    res.sendfile('public/index.html');
});

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
    req.models.contestant.selectContestant(req.body.userId, req.body.weekId, req.body.contestantId, function(data) {
        res.send(data);
    });
});

app.post('/removeContestant', function(req, res) {
    console.log('removeContestant: ' + JSON.stringify(req.body));
    console.log(req.body.userId);
    console.log(req.body.weekId);
    console.log(req.body.contestantId);
    req.models.contestant.removeContestant(req.body.userId, req.body.weekId, req.body.contestantId, function(data) {
        res.send("score! " + data);
    });
});

app.get('/getLeaderboard', function(req, res) {
    console.log('getLeaderboard');
    res.send([
        {
            name: 'Mitchell Loeppky',
            score: 100
        },
        {
            name: 'Tore Hanssen',
            score: 200
        },
        {
            name: 'Elijahim Chinus',
            score: 63
        }
    ]);
});

app.listen(getPort());
console.log('Listening on port ' + getPort());

function getPort() {
    return process.env.PORT || 8000;
}