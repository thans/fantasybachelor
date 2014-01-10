var express = require('express');
var database = require('./database');
var compressor = require('node-minify');

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
    console.log('loginUser: ' + JSON.stringify(req.body));
    req.models.user.login(req.body, function(user) {
        res.send(user);
    });
});

app.get('/getWeeks', function (req, res) {
    console.log('getWeeks: ' + JSON.stringify(req.query));
    req.models.week.getWeeks(req.query.userId, function(data) {
        res.send(data);
    });
});

app.get('/getContestants', function (req, res) {
    console.log('getContestants: ' + JSON.stringify(req.body));
    req.models.contestant.getContestantData(req.body, function(data) {
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
    req.models.contestant.removeContestant(req.body.userId, req.body.weekId, req.body.contestantId, function(data) {
        res.send("score! " + data);
    });
});

app.get('/getLeaderboard', function(req, res) {
    console.log('getLeaderboard');
    req.models.user.getUnupdatedScores(function(data) {
        res.send(data);
    })
});

app.get('/getActiveUsers', function(req, res) {
    console.log('get active users');
    req.models.prediction.getActiveUsers(function(data) {
        res.send(data);
    })
});

new compressor.minify({
    type: 'uglifyjs',
    fileIn: ['public/js/dependencies/jquery.js', 'public/js/dependencies/underscore.js', 'public/js/dependencies/sly.js', 'public/js/dependencies/moment.js', 'public/js/classes/constants.js', 'public/js/classes/urls.js', 'public/js/classes/selectionModes.js', 'public/js/classes/utils.js', 'public/js/classes/weekData.js', 'public/js/classes/contestantData.js', 'public/js/classes/contestantButton.js', 'public/js/classes/dropdown.js', 'public/js/classes/contestantLayout.js', 'public/js/classes/bioModal.js', 'public/js/classes/facebook.js', 'public/js/classes/navigationManager.js', 'public/js/app.js'],
    fileOut: 'public/js/app.min.js',
    callback: function(err){
        if (err) {
            console.log(err);
        } else {
            console.log('Minified js');
        }
    }
});

app.listen(getPort());
console.log('Listening on port ' + getPort());

function getPort() {
    return process.env.PORT || 8000;
}

