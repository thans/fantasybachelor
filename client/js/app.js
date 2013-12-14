var CONSTANTS = {};
CONSTANTS.IMAGES_DIR = 'images/';
CONSTANTS.SMALL_WOMEN_DIR = CONSTANTS.IMAGES_DIR + 'womenSmall/';
CONSTANTS.MEDIUM_WOMEN_DIR = CONSTANTS.IMAGES_DIR + 'womenMedium/';
CONSTANTS.LARGE_WOMEN_DIR = CONSTANTS.IMAGES_DIR + 'womenLarge/';
CONSTANTS.DEFAULT_WOMAN_SMALL = CONSTANTS.SMALL_WOMEN_DIR + 'womanSmall.png';
CONSTANTS.DEFAULT_WOMAN_MEDIUM = CONSTANTS.MEDIUM_WOMEN_DIR + 'womanMedium.png';
CONSTANTS.DEFAULT_WOMAN_LARGE = CONSTANTS.LARGE_WOMEN_DIR + 'womanLarge.png';

var utils = {
    getSmallImage: function(contestant) {
        return CONSTANTS.SMALL_WOMEN_DIR + contestant.codeName + 'Small.png';
    },

    getMediumImage: function(contestant) {
        return CONSTANTS.MEDIUM_WOMEN_DIR + contestant.codeName + 'Medium.png';
    },

    getLargeImage: function(contestant) {
        return CONSTANTS.LARGE_WOMEN_DIR + contestant.codeName + 'Large.png';
    }
}

var ContestantData = function() {
    var contestants = [
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
                    value: '5’7”'
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
    ];

    this.loadContestants = function(callback) {
        callback();
    }

    this.getContestantById = function(contestantId) {
        var contestant = false;
        $.each(contestants, function(i, v) {
            if (v.id === contestantId) {
                contestant = v;
            }
        });
        return contestant;
    };
}
var contestantData = new ContestantData();

var WeekData = function() {
    this.getWeeks = function(callback) {

        // Temp Data
        callback([
            {
                id: 1,
                name: 'Week 1'
            },
            {
                id: 2,
                name: 'Week 2'
            },
            {
                id: 3,
                name: 'Week 3'
            }
        ]);
    };

    this.getCurrentWeek = function(callback) {
        callback(2);
    };

    this.getWeekById = function(id, callback) {
        var week;
        $.each(weekData, function(i, v) {
            if (v.id === id) {
                week = v;
                return false;
            }
        });
        callback(week);
    };

    // Temp Data
        var weekData = [
            {
                id: 1,
                name: 'Week 1',
                openTime: new Date(2013, 11, 1),
                closeTime: new Date(2013, 11, 30),
                remainingWomen: [
                    {
                        id: 1,
                        multiplier: 2
                    }
                ],
                selectedWomen: [1],
                numberOfSelections: 6
            },
            {
                id: 2,
                name: 'Week 2',
                openTime: new Date(2013, 12, 1),
                closeTime: new Date(2013, 12, 30),
                remainingWomen: [
                    {
                        id: 1,
                        multiplier: 2
                    }
                ],
                selectedWomen: [1],
                numberOfSelections: 6
            },
            {
                id: 3,
                name: 'Week 3',
                openTime: new Date(2014, 1, 1),
                closeTime: new Date(2014, 1, 30),
                remainingWomen: [
                    {
                        id: 1,
                        multiplier: 2
                    }
                ],
                selectedWomen: [1],
                numberOfSelections: 6
            }
        ];
}

var wd = new WeekData();
wd.getWeeks(function(weeks) {
    contestantData.loadContestants(function() {
        $.each(weeks, function(i, v) {
            $('<li>')
                .attr('data-id', v.id)
                .addClass('left')
                .toggleClass('first', i === 0)
                .text(v.name)
                .click(function() {
                    navManager.goToWeek(v.id);
                    history.pushState({func: 'goToWeek', data: v.id}, null, '#weekId=' + v.id);
                })
                .appendTo('#navigation');
        });
    });
});

var fb = new Facebook().loadSdk(function() {
    fb.silentLogin(authChangeHandler);
});

$('#login .loginWithFacebook').click(function() {
    fb.login(authChangeHandler);
    $(this).addClass('disabled');
});

$('header .user').click(function() {
    fb.logout(authChangeHandler);
    //authChangeHandler(); // Log out without logging out of FB
});

var isLoggedIn = false;
function authChangeHandler(user) {
    if (user) {
        isLoggedIn = true;

        // Put username in the top corner
        $('header .user').text(user.name).hover(function() {
            $(this).width($(this).width()).text('Log Out');
        }, function() {
            if (user && user.name) {
                $(this).width('auto').text(user.name);
            }
        });

        // Show correct week
        wd.getCurrentWeek(function(weekId) {
            navManager.goToWeek(weekId);
            history.replaceState({func: 'goToWeek', data: weekId}, null, '#weekId=' + weekId);
        })
    } else {
        isLoggedIn = false;
        navManager.goToLogin();
        history.pushState({func: 'goToLogin'}, null, '#login');
    }
}

$(window).bind('popstate', function() {
    console.log('POP: ');
    console.log(history.state);
    console.log(' ');
    history.state && history.state.func && navManager[history.state.func](history.state.data);
});

var NavigationManager = function() {
    this.goToLogin = function() {
        // Hide main section, show login section
        $('#login').show();
        $('#main').hide();

        // Enable login button
        $('#login .loginWithFacebook').removeClass('disabled');
    };

    this.goToWeek = function(weekId) {
        if (isLoggedIn) {

            // Show main section, hide login section
            $('#login').hide();
            $('#main').show();

            // Set selected class on navbar element
            $('#navigation .selected').removeClass('selected');
            $('#navigation li[data-id="'+weekId+'"]').addClass('selected');

            // Load week data
            wd.getWeekById(weekId, function(weekData) {

                // Display Week title
                $('#selectedWomen .sectionTitle').text(weekData.name);

                // Set remaining women
                $('#women').empty();
                $.each(weekData.remainingWomen, function(i, v) {
                    var woman = contestantData.getContestantById(v.id);
                    $('<li>')
                        .attr('data-id', woman.id)
                        .css('background-image', 'url("' + utils.getSmallImage(woman) + '")')
                        .text(woman.name)
                        .appendTo('#women');
                });

                // Set selected women
                $('.selectedWomenLayout').hide();
                var layout = $('.selectedWomenLayout.select' + weekData.numberOfSelections);
                layout.find('.woman').css('background-image', '');
                $.each(weekData.selectedWomen, function(i, v) {
                    layout
                        .find('.woman' + (i + 1))
                        .css('background-image', 'url("' + utils.getMediumImage(contestantData.getContestantById(v)) + '")');
                })
                layout.show();
            })

        }
    };

    this.goToLeaderboard = function() {

    };
}
var navManager = new NavigationManager();
