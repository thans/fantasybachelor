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
                    var contestant = cd.getContestantById(v.id);
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
                            contestantLayout.addContestant(cd.getContestantById(v.id), v.multiplier, _.contains(weekData.eliminatedContestants, v.id), function() {
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