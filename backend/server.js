var express = require('express');
var database = require('./database');

var app = express();

console.log('Running in: ' + process.env.NODE_ENV);

app.use(database.getExpressConnection());


app.get('/numUsers', function (req, res) {
    req.models.user.count(function(err, count) {
        if (err) throw err;
        res.send('Number of users: ' + count);
    });
});

app.get('/loginUser', function (req, res) {
    req.models.user.login(req.query, function(score) {
        res.send('User score: ' + score);
    })
});

app.listen(getPort());
console.log('Listening on port ' + getPort());

function getPort() {
    return process.env.NODE_ENV === 'production' && 80 || 8000;
}
