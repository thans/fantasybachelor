var express = require('express');
var database = require('./database');

var app = express();

console.log('Running in: ' + process.env.NODE_ENV);

app.use(express.compress());
app.use(database.getExpressConnection());
app.use(express.bodyParser());

app.use('/js', express.static('backend/public/js'));
app.use('/css', express.static('backend/public/css'));
app.use('/images', express.static('backend/public/images'));

app.get('/', function(req, res) {
    res.sendfile('backend/public/index.html');
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
    req.models.week.getWeeks(req.body, function(data) {
        res.send(data);
    });
    /*
    res.send([
        {
            id: 1,
            name: 'Week 1',
            openTime: new Date(2013, 11, 1),
            closeTime: new Date(2013, 11, 30),
            scoresAvailableTime: new Date(2013, 11, 31),
            remainingContestants: [
                {
                    id: 1,
                    multiplier: 1
                },
                {
                    id: 2,
                    multiplier: 1
                },
                {
                    id: 3,
                    multiplier: 1
                },
                {
                    id: 1,
                    multiplier: 1
                },
                {
                    id: 2,
                    multiplier: 1
                },
                {
                    id: 3,
                    multiplier: 1
                },
                {
                    id: 1,
                    multiplier: 1
                },
                {
                    id: 2,
                    multiplier: 1
                },
                {
                    id: 3,
                    multiplier: 1
                },
                {
                    id: 1,
                    multiplier: 1
                },
                {
                    id: 2,
                    multiplier: 1
                },
                {
                    id: 3,
                    multiplier: 1
                }
            ],
            selectedContestants: [2, 3],
            eliminatedContestants: [3],
            numberOfSelections: 6
        },
        {
            id: 2,
            name: 'Week 2',
            openTime: new Date(2014, 0, 1),
            closeTime: new Date(2014, 0, 30),
            scoresAvailableTime: new Date(2014, 0, 31),
            remainingContestants: [
                {
                    id: 1,
                    multiplier: 1
                },
                {
                    id: 2,
                    multiplier: 2
                }
            ],
            selectedContestants: [2],
            numberOfSelections: 6
        },
        {
            id: 3,
            name: 'Week 3',
            openTime: new Date(2014, 1, 1),
            closeTime: new Date(2014, 1, 30),
            scoresAvailableTime: new Date(2014, 1, 31),
            remainingContestants: [
                {
                    id: 1,
                    multiplier: 3
                },
                {
                    id: 2,
                    multiplier: 1
                }
            ],
            selectedContestants: [],
            numberOfSelections: 6
        }
    ]);
*/
});

app.get('/getContestants', function (req, res) {
    req.models.contestant.getContestantData(req.body, function(data) {
        console.log('WeekData: ' + JSON.stringify(data));
        res.send(data);
    });
    /*

    res.send([
        {
            id: 1,
            name: 'Alexis',
            codeName: 'alexis',
            stats: [
                {
                    key: 'Age',
                    value: '31'
                },
                {
                    key: 'Occupation',
                    value: 'Message Therapist'
                },
                {
                    key: 'Hometown',
                    value: 'Apopka, FL'
                },
                {
                    key: 'Height',
                    value: '5\'7\"'
                },
                {
                    key: 'Tattoos',
                    value: 'None'
                },
                {
                    key: 'Favorite Actress',
                    value: 'Kate Winslet'
                },
                {
                    key: 'Top 3 Favorite Groups/Artists',
                    value: 'The Beatles, Bob Dylan, Radiohead'
                },
                {
                    key: 'Favorite Sports Team',
                    value: 'LA Clippers'
                }
            ],
            questions: [
                {
                    key: 'What is your favorite memory from your childhood?',
                    value: 'The family trip we took to Lake Tahoe. I\'d never seen anything more gorgeous in my life, I learned how to play foosball, ate California Sourdough toast and laughed til my belly hurt with my family.'
                },
                {
                    key: 'What is your favorite holiday and why?',
                    value: 'It\'s close. Thanksgiving because it\'s such a cool day for everyone to just be thankful, give back and eat! And I also LOVE the Fourth of July because it\'s so romantic and I\'m grateful for our freedom!'
                },
                {
                    key: 'What do you hope to get out of participating in this television show?',
                    value: 'I hope to find love! And if He decides I\'m not the girl for him, I hope to gain friendships, peace through time away, a greater understanding of people and love and the beautiful world around me.'
                },
                {
                    key: 'If you wanted to really impress a man, what would you do and why?',
                    value: 'I would try to find out some secret wish or childhood dream, then figure out a way to make it come true. Something they\'ve always wanted or wanted to try. We all have them and it means a lot when the person you love is invested in those things.'
                }
            ]
        },
        {
            id: 2,
            name: 'Alli',
            codeName: 'alli',
            stats: [
                {
                    key: 'Age',
                    value: '31'
                },
                {
                    key: 'Occupation',
                    value: 'Message Therapist'
                },
                {
                    key: 'Hometown',
                    value: 'Apopka, FL'
                },
                {
                    key: 'Height',
                    value: '5\'7\"'
                },
                {
                    key: 'Tattoos',
                    value: 'None'
                },
                {
                    key: 'Favorite Actress',
                    value: 'Kate Winslet'
                },
                {
                    key: 'Top 3 Favorite Groups/Artists',
                    value: 'The Beatles, Bob Dylan, Radiohead'
                },
                {
                    key: 'Favorite Sports Team',
                    value: 'LA Clippers'
                }
            ],
            questions: [
                {
                    key: 'What is your favorite memory from your childhood?',
                    value: 'The family trip we took to Lake Tahoe. I\'d never seen anything more gorgeous in my life, I learned how to play foosball, ate California Sourdough toast and laughed til my belly hurt with my family.'
                },
                {
                    key: 'What is your favorite holiday and why?',
                    value: 'It\'s close. Thanksgiving because it\'s such a cool day for everyone to just be thankful, give back and eat! And I also LOVE the Fourth of July because it\'s so romantic and I\'m grateful for our freedom!'
                },
                {
                    key: 'What do you hope to get out of participating in this television show?',
                    value: 'I hope to find love! And if He decides I\'m not the girl for him, I hope to gain friendships, peace through time away, a greater understanding of people and love and the beautiful world around me.'
                },
                {
                    key: 'If you wanted to really impress a man, what would you do and why?',
                    value: 'I would try to find out some secret wish or childhood dream, then figure out a way to make it come true. Something they\'ve always wanted or wanted to try. We all have them and it means a lot when the person you love is invested in those things.'
                }
            ]
        },
        {
            id: 3,
            name: 'Amy J',
            codeName: 'amyJ',
            stats: [
                {
                    key: 'Age',
                    value: '31'
                },
                {
                    key: 'Occupation',
                    value: 'Message Therapist'
                },
                {
                    key: 'Hometown',
                    value: 'Apopka, FL'
                },
                {
                    key: 'Height',
                    value: '5\'7\"'
                },
                {
                    key: 'Tattoos',
                    value: 'None'
                },
                {
                    key: 'Favorite Actress',
                    value: 'Kate Winslet'
                },
                {
                    key: 'Top 3 Favorite Groups/Artists',
                    value: 'The Beatles, Bob Dylan, Radiohead'
                },
                {
                    key: 'Favorite Sports Team',
                    value: 'LA Clippers'
                }
            ],
            questions: [
                {
                    key: 'What is your favorite memory from your childhood?',
                    value: 'The family trip we took to Lake Tahoe. I\'d never seen anything more gorgeous in my life, I learned how to play foosball, ate California Sourdough toast and laughed til my belly hurt with my family.'
                },
                {
                    key: 'What is your favorite holiday and why?',
                    value: 'It\'s close. Thanksgiving because it\'s such a cool day for everyone to just be thankful, give back and eat! And I also LOVE the Fourth of July because it\'s so romantic and I\'m grateful for our freedom!'
                },
                {
                    key: 'What do you hope to get out of participating in this television show?',
                    value: 'I hope to find love! And if He decides I\'m not the girl for him, I hope to gain friendships, peace through time away, a greater understanding of people and love and the beautiful world around me.'
                },
                {
                    key: 'If you wanted to really impress a man, what would you do and why?',
                    value: 'I would try to find out some secret wish or childhood dream, then figure out a way to make it come true. Something they\'ve always wanted or wanted to try. We all have them and it means a lot when the person you love is invested in those things.'
                }
            ]
        }
    ]);
*/
});

app.post('/selectContestant', function(req, res) {
    console.log('selectContestant: ' + JSON.stringify(req.body));
    res.send('Sweet!');
});

app.post('/removeContestant', function(req, res) {
    console.log('removeContestant: ' + JSON.stringify(req.body));
    res.send('Sweet!');
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
