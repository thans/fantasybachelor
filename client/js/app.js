var CONSTANTS = {};
CONSTANTS.IMAGES_DIR = 'images/';
CONSTANTS.SMALL_CONTESTANTS_DIR = CONSTANTS.IMAGES_DIR + 'contestantsSmall/';
CONSTANTS.MEDIUM_CONTESTANTS_DIR = CONSTANTS.IMAGES_DIR + 'contestantsMedium/';
CONSTANTS.LARGE_CONTESTANTS_DIR = CONSTANTS.IMAGES_DIR + 'contestantsLarge/';
CONSTANTS.DEFAULT_CONTESTANT_SMALL = CONSTANTS.SMALL_CONTESTANTS_DIR + 'womanSmall.png';
CONSTANTS.DEFAULT_CONTESTANT_MEDIUM = CONSTANTS.MEDIUM_CONTESTANTS_DIR + 'womanMedium.png';
CONSTANTS.DEFAULT_CONTESTANT_LARGE = CONSTANTS.LARGE_CONTESTANTS_DIR + 'womanLarge.png';

CONSTANTS.CONTESTANT_ARRANGEMENTS = {
    6: [3, 3],
    5: [3, 2],
    4: [2, 2],
    3: [3],
    2: [2],
    1: [1]
}

var utils = {
    getSmallImage: function(contestant) {
        return CONSTANTS.SMALL_CONTESTANTS_DIR + contestant.codeName + 'Small.png';
    },

    getMediumImage: function(contestant) {
        return CONSTANTS.MEDIUM_CONTESTANTS_DIR + contestant.codeName + 'Medium.png';
    },

    getLargeImage: function(contestant) {
        return CONSTANTS.LARGE_CONTESTANTS_DIR + contestant.codeName + 'Large.png';
    }
}

$.fn.backgroundImage = function(backgroundImage) {
    return this.each(function() {
        if (backgroundImage) {
            $(this).css('background-image', 'url("' + backgroundImage + '")');
        } else {
            $(this).css('background-image', '');
        }
    });
};

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
                openTime: new Date(2013, 10, 1),
                closeTime: new Date(2013, 10, 29),
                scoresAvailableTime: new Date(2013, 10, 30),
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
                        multiplier: 2
                    }
                ],
                selectedContestants: [2],
                numberOfSelections: 6
            },
            {
                id: 3,
                name: 'Week 3',
                openTime: new Date(2014, 0, 1),
                closeTime: new Date(2014, 0, 30),
                scoresAvailableTime: new Date(2014, 0, 31),
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
                $('#selectedContestants .sectionTitle').text(weekData.name);

                // Set remaining contestants
                $('#contestantContainer').empty();
                var selectionClosed = moment().isBefore(weekData.openTime) || moment().isAfter(weekData.closeTime);
                var selectionFull = weekData.selectedContestants.length === weekData.numberOfSelections;
                $.each(weekData.remainingContestants, function(i, v) {
                    var contestant = contestantData.getContestantById(v.id);
                    var selected = _.contains(weekData.selectedContestants, v.id);

                    var button = new ContestantButton()
                        .contestant(contestant)
                        .selected(selected)
                        .selectionClosed(selectionClosed)
                        .selectionFull(selectionFull)
                        .multiplier(v.multiplier)
                        .click(function() {
                            bioModal.setContestant(this.contestant(), this.mode(), $.proxy(function(selected) {
                                this.selected(selected);
                                console.log("contestant: " + this.contestant().id + " selected: " + selected);
                                if (!selected) {
                                    weekData.selectedContestants = _.without(weekData.selectedContestants, this.contestant().id);
                                } else {
                                    weekData.selectedContestants.push(this.contestant().id);
                                }
                                displaySelectedContestants();
                            }, this)).show();
                        })
                        .appendTo('#contestantContainer');
                });

                // Set selected contestants
                var selectedContestantsWrapper = $('#selectedContestantsLayoutWrapper').empty();
                var contestantLayout = new ContestantLayout(CONSTANTS.CONTESTANT_ARRANGEMENTS[weekData.numberOfSelections], selectedContestantsWrapper, moment().isAfter(weekData.scoresAvailableTime));
                var displaySelectedContestants = function() {
                    contestantLayout.clear();
                    $.each(weekData.remainingContestants, function(i, v) {
                        if (_.contains(weekData.selectedContestants, v.id)) {
                            contestantLayout.addContestant(contestantData.getContestantById(v.id), v.multiplier, _.contains(weekData.eliminatedContestants, v.id), function() {
                                $('#contestantContainer [data-id="' + v.id + '"]').click();
                            });
                        }
                    });
                }
                displaySelectedContestants();

                var selectionStatus = $('#selectionStatus');
                if (moment().isAfter(weekData.scoresAvailableTime)) {
                    selectionStatus.attr('data-color', 'red').text('Selection Closed');
                } else if (moment().isBefore(weekData.openTime)) {
                    selectionStatus.attr('data-color', 'yellow').text('Coming Soon');
                } else if (moment().isBefore(weekData.closeTime)) {
                    selectionStatus.attr('data-color', 'green').text('Selection Open');
                } else {
                    selectionStatus.attr('data-color', 'yellow').text('Show in Progress');
                }

                var slyElement = $('#remainingContestants .well');
                var sly = new Sly(slyElement, {
                    itemNav: 'basic',
                    smart: 1,
                    scrollBy: 1,
                    speed: 300,
                    keyboardNavBy: 'pages',
                    easing: 'linear',

                    // Buttons
                    prevPage: slyElement.parent().find('.upArrow'),
                    nextPage: slyElement.parent().find('.downArrow')
                }).init();
                sly.on('moveStart', function() {slyElement.addClass('moving')});
                sly.on('moveEnd', function() {slyElement.removeClass('moving')});
                sly.reload();
            })

        }
    };

    this.goToLeaderboard = function() {

    };
}
var navManager = new NavigationManager();

var BioModal = function(element) {
    element = $(element);

    this.setContestant = function(contestant, mode, clickHandler) {
        element.find('.close, .chooseMe, .removeMe').andSelf()
            .off('click')
            .click(function() {
                element.hide();
            }).children().click(function(e) {
                    e.stopPropagation();
            });

        element.find('.title').text(contestant.name);

        var stats = element.find('.stats').empty();
        $.each(contestant.stats, function(i, v) {
            stats.append('<div class="stat"><span class="name">' + v.key + ':</span> ' + v.value + '</div>');
        });

        var questions = element.find('.questions').empty();
        $.each(contestant.questions, function(i, v) {
            questions.append('<div class="question"><span class="q">' + v.key + '</span><br>' + v.value + '</div>');
        });

        element.find('.contestant').backgroundImage(utils.getLargeImage(contestant));

        element.find('.btn-large').hide();
        switch (mode) {
            case SELECTION_MODES.CHOOSABLE:
                element.find('.chooseMe').click(function() {
                    clickHandler(true);
                }).show();
                break;
            case SELECTION_MODES.REMOVABLE:
                element.find('.removeMe').click(function() {
                    clickHandler(false);
                }).show();
                break;
            case SELECTION_MODES.CONTESTANT_UNSELECTABLE:
                break;
            default:
                element.find('.disabled').text(mode).show();
                break;
        }
        return this;
    }

    this.show = function() {
        element.show();
        return this;
    }
    this.hide = function() {
        element.hide();
        return this;
    }
}
var bioModal = new BioModal('#bioModal');

var SELECTION_MODES = {
    CONTESTANT_UNSELECTABLE: 'Unselected', // This contestant can't be selected under any circumstance
    SELECTION_CLOSED: 'Selection Closed', // Out of the time frame to select contestants
    SELECTION_FULL: 'Selection Full', // All of the available selections are taken
    REMOVABLE: 'Remove Me', // The contestant is selected and is therefore unselectable
    CHOOSABLE: 'Choose Me' // THe contestant is unselected and is therefore selectable
}

var ContestantButton = function() {
    var selectionFull = false;
    var selectableContestant = true;
    var selectionClosed = false;
    var selected = false;
    var contestant;
    var multiplier;
    var element = $('<div>');

    var _click = function(handler) {
        if (handler) {
            element.off('click').click($.proxy(handler, this));
        }
        return this;
    }
    this.click = _click;

    var _selectionFull = function(isSelectionFull) {
        if (isSelectionFull !== undefined) {
            selectionFull = isSelectionFull;
            return this;
        } else {
            return selectionFull;
        }
    }
    this.selectionFull = _selectionFull;

    var _selectableContestant = function(isSelectableContestant) {
        if (isSelectableContestant !== undefined) {
            selectableContestant = isSelectableContestant;
            return this;
        } else {
            return selectableContestant;
        }
    }
    this.selectableContestant = _selectableContestant;

    var _selectionClosed = function(isSelectionClosed) {
        if (isSelectionClosed !== undefined) {
            selectionClosed = isSelectionClosed;
            return this;
        } else {
            return selectionClosed;
        }
    }
    this.selectionClosed = _selectionClosed;

    var _mode = function() {
        if (!selectableContestant) {
            return SELECTION_MODES.CONTESTANT_UNSELECTABLE;
        } else if (selectionClosed) {
            return SELECTION_MODES.SELECTION_CLOSED;
        } else if (selectionFull) {
            return SELECTION_MODES.SELECTION_FULL;
        } else if (selected) {
            return SELECTION_MODES.REMOVABLE;
        }
        return SELECTION_MODES.CHOOSABLE;
    }
    this.mode = _mode;

    var _selected = function(isSelected) {
        if (isSelected !== undefined) {
            selected = isSelected;
            element.toggleClass('selected', selected);
            return this;
        } else {
            return selected;
        }
    }
    this.selected = _selected;

    var _contestant = function(newContestant) {
        if (newContestant !== undefined) {
            contestant = newContestant;
            element
                .attr('data-id', contestant.id)
                .css('background-image', 'url("' + utils.getSmallImage(contestant) + '")')
                .text(contestant.name);
            return this;
        } else {
            return contestant;
        }
    }
    this.contestant = _contestant;

    var multiplier = function(newMultiplier) {
        if (newMultiplier !== undefined) {
            multiplier = newMultiplier;
            if (multiplier > 1) {
                element.append('<div class="score" data-color="yellow">&times;' + multiplier + '</div>');
            } else {
                element.empty().text(contestant.name);
            }
            return this;
        } else {
            return multiplier;
        }
    }
    this.multiplier = multiplier;

    var _appendTo = function(parent) {
        if (parent !== undefined) {
            element.appendTo('<li>').parent().appendTo(parent);
        }
        return this;
    }
    this.appendTo = _appendTo;

}

var ContestantLayout = function(arrangement, parentSelector, isScoringComplete) {
    var element = $('<div>').addClass('contestantLayout').appendTo(parentSelector);
    var scoringComplete = isScoringComplete;

    var contestantNum = 0;
    $.each(arrangement, function(i, v) {
        var row = $('<div>').addClass('row');
        for (var i = 0; i < v; i++) {
            contestantNum++;
            $('<div>')
                .addClass('contestant')
                .addClass('contestant' + contestantNum)
                .append('\
                    <div class="score"></div>\
                    <div class="image"></div>\
                ')
                .appendTo(row);
        }
        row.appendTo(element);
    });

    var numSelectedContestants = 0;

    var _clear = function() {
        element.find('.contestant')
            .off('click')
            .removeClass('enabled');
        element.find('.image')
            .backgroundImage('');
        element.find('.score')
            .attr('data-color', '');
        numSelectedContestants = 0;
    }
    this.clear = _clear;

    var _addContestant = function(contestant, multiplier, isEliminated, clickHandler) {
        if (numSelectedContestants < contestantNum) {
            numSelectedContestants++;
            var contestantElement = element.find('.contestant' + numSelectedContestants);
            contestantElement
                .click(clickHandler)
                .addClass('enabled');
            contestantElement.find('.image')
                .backgroundImage(utils.getMediumImage(contestant));
            if (scoringComplete) {
                if (isEliminated) {
                    contestantElement.find('.score')
                        .attr('data-color', 'red')
                        .text('-');
                } else {
                    contestantElement.find('.score')
                        .attr('data-color', 'green')
                        .text('+' + multiplier);
                }
            } else if (multiplier > 1) {
                contestantElement.find('.score')
                    .attr('data-color', 'yellow')
                    .html('&times;' + multiplier);
            }


        }
        return this;
    }
    this.addContestant = _addContestant;
}