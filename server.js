var express = require('express');
var database = require('./database');
var compressor = require('node-minify');

var app = express();

console.log('Running in: ' + process.env.NODE_ENV);

app.use(express.compress());
app.use(express.bodyParser());

app.use('/js', express.static('public/js'));
app.use('/css', express.static('public/css'));
app.use('/images', express.static('public/images'));

app.get('/', function(req, res) {
    res.sendfile('public/index.html');
});

app.post('/loginUser', function (req, res) {
    console.log('loginUser: ' + JSON.stringify(req.body));
    database.User.login(req.body).then(responseFunction(res)).fail(errorFunction(res));
});

app.get('/getWeeks', function (req, res) {
    console.log('getWeeks: ' + JSON.stringify(req.query));
    database.Weeks.getExtended(req.query.userId, responseFunction(res), errorFunction(res));
});

app.get('/getContestants', function (req, res) {
    console.log('getContestants: ' + JSON.stringify(req.body));
    database.Contestants.getAll(responseFunction(res), errorFunction(res));
});

app.post('/selectContestant', function(req, res) {
    console.log('selectContestant: ' + JSON.stringify(req.body));
    database.Predictions.makePrediction(req.body.userId, req.body.weekId, req.body.contestantId, responseFunction(res), errorFunction(res));
});

app.post('/removeContestant', function(req, res) {
    console.log('removeContestant: ' + JSON.stringify(req.body));
    database.Predictions.removePrediction(req.body.userId, req.body.weekId, req.body.contestantId, responseFunction(res), errorFunction(res));
});

app.get('/getStatistics', function(req, res) {
    console.log('getStatistics');
    database.Weeks.getWeeklyPredictions(responseFunction(res), errorFunction(res));
});

app.get('/getLeaderboard', function(req, res) {
    console.log('getLeaderboard');
    database.User.getLeaderboard(responseFunction(res), errorFunction(res));
});

new compressor.minify({
    type: 'uglifyjs',
    fileIn: ['public/js/dependencies/jquery.js', 'public/js/dependencies/underscore.js', 'public/js/dependencies/sly.js', 'public/js/dependencies/moment.js', 'public/js/classes/constants.js', 'public/js/classes/urls.js', 'public/js/classes/selectionModes.js', 'public/js/classes/utils.js', 'public/js/classes/weekData.js', 'public/js/classes/contestantData.js', 'public/js/classes/contestantButton.js', 'public/js/classes/dropdown.js', 'public/js/classes/contestantLayout.js', 'public/js/classes/bioModal.js', 'public/js/classes/facebook.js', 'public/js/classes/lineChart.js', 'public/js/classes/navigationManager.js', 'public/js/app.js'],
    fileOut: 'public/js/app.min.js',
    callback: function(err){
        if (err) {
            console.log(err);
        } else {
            console.log('Minified js');
        }
    }
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
