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

            // Show main section, hide login section, hide other sections, show this section
            $('#login').hide();
            $('#main').show();
            $('section').hide();
            $('#contestantSelectionWrapper').show();

            // Get week data
            var weekData = wd.getWeekById(weekId);

            // Display Week title
            $('#selectedContestants .sectionTitle').text(weekData.name);

            // Set remaining contestants
            $('#contestantContainer').empty();
            var selectionClosed = moment().isBefore(weekData.openTime) || moment().isAfter(weekData.closeTime);
            $.each(weekData.remainingContestants, function(i, v) {
                var contestant = cd.getContestantById(v.id);
                var selected = _.contains(weekData.selectedContestants, v.id);

                var button = new ContestantButton()
                    .contestant(contestant)
                    .selected(selected)
                    .selectionClosed(selectionClosed)
                    .selectionFull(function() {
                        return weekData.selectedContestants.length === weekData.numberOfSelections
                    })
                    .multiplier(v.multiplier)
                    .click(function() {
                        bioModal.setContestant(this.contestant(), this.mode(), $.proxy(function(selected) {
                            this.selected(selected);
                            console.log("contestant: " + this.contestant().id + " selected: " + selected);
                            if (!selected) {
                                weekData.selectedContestants = _.without(weekData.selectedContestants, this.contestant().id);
                                $.post(URLS.REMOVE_CONTESTANT, {
                                    contestantId: this.contestant().id,
                                    userId: user.id,
                                    weekId: weekData.id
                                });
                            } else {
                                weekData.selectedContestants.push(this.contestant().id);
                                $.post(URLS.SELECT_CONTESTANT, {
                                    contestantId: this.contestant().id,
                                    userId: user.id,
                                    weekId: weekData.id
                                });
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
                        contestantLayout.addContestant(cd.getContestantById(v.id), v.multiplier, _.contains(weekData.eliminatedContestants, v.id), function() {
                            $('#contestantContainer [data-id="' + v.id + '"]').click();
                        });
                    }
                });
            }
            displaySelectedContestants();

            var selectionStatus = $('#selectionStatus');
            var color; var text; var note;
            if (moment().isAfter(weekData.scoresAvailableTime)) {
                color = 'red';
                text = 'Selection Closed';
                note = 'Your score has been updated';
            } else if (moment().isBefore(weekData.openTime)) {
                color = 'yellow';
                text = 'Coming Soon';
                note = 'Selection opens ' + moment(weekData.openTime).format("h:mm a dddd MMM D");
            } else if (moment().isBefore(weekData.closeTime)) {
                color = 'green';
                text = 'Selection Open';
                note = 'Open until ' + moment(weekData.closeTime).format("h:mm a dddd MMM D");
            } else {
                color = 'yellow';
                text = 'Show in Progress';
                note = 'Scores available ' + moment(weekData.scoresAvailableTime).format("h:mm a dddd MMM D");
            }
            selectionStatus.attr('data-color', color);
            selectionStatus.find('.text').text(text);
            selectionStatus.find('.note').text(note);

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
        }
    };

    this.goToLeaderboard = function() {
        if (isLoggedIn) {

            // Show main section, hide login section, hide other sections, show this section
            $('#login').hide();
            $('#main').show();
            $('section').hide();
            $('#leaderboardWrapper').show();

            $.get(URLS.GET_LEADERBOARD).done(function(data) {
                var table = $('#leaderboard .data');
                table.find('.dataRow').remove();
                $.each(data, function(i, v) {
                    v.score > 0 && table.append('<tr class="dataRow"><td>' + v.firstName + ' ' + v.lastName + '</td><td>' + v.score + '</td></tr>');
                });
            })
        }
    };

    this.goToStatistics = function() {
        if (isLoggedIn) {

            // Show main section, hide login section, hide other sections, show this section
            $('#login').hide();
            $('#main').show();
            $('section').hide();
            $('#statisticsWrapper').show();
            $.get(URLS.GET_STATISTICS).done(function(data) {
                var selectionChart = grapher.contestantsByWeek('#statsLine', data);
            });
        }
    };

    this.goToTheBach = function() {
        if (isLoggedIn) {

            // Show main section, hide login section, hide other sections, show this section
            $('#login').hide();
            $('#main').show();
            $('section').hide();
            var element = $('#theBachWrapper').show();

            var contestant = cd.getContestantById(CONSTANTS.BACH_ID);
            console.log("got contestant: ", contestant);

            var stats = element.find('.stats').empty();
            $.each(contestant.bioStatistics, function(i, v) {
                stats.append('<div class="stat"><span class="name">' + v.name + ':</span> ' + v.value + '</div>');
            });

            var questions = element.find('.questions').empty();
            $.each(contestant.bioQuestions, function(i, v) {
                questions.append('<div class="question"><span class="q">' + v.question + '</span><br>' + v.answer + '</div>');
            });

            element.find('.contestant').backgroundImage(utils.getLargeImage(contestant));
        }
    };

    this.goToHowItWorks = function() {
        if (isLoggedIn) {

            // Show main section, hide login section, hide other sections, show this section
            $('#login').hide();
            $('#main').show();
            $('section').hide();
            var element = $('#howItWorksWrapper').show();
        }
    };
}
