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


            $(function () {
                $('#statsPie').highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                        text: 'Most Selected Contestants, Week 7'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    credits: {
                        enabled: false
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                color: '#000000',
                                connectorColor: '#000000',
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'Percent Picked',
                        data: [
                            {
                                name: 'Andi',
                                y: 45.0,
                                sliced: true,
                                selected: true
                            },
                            ['Chelsae',       26.8],
                            ['Claire', 12.8],
                            ['Nikki',    8.5],
                            ['Renee',     6.9]
                        ]
                    }]
                });
            });

            $(function () {
                    $('#statsLine').highcharts({
                        chart: {
                            type: 'area'
                        },
                        title: {
                            text: 'Players who Selected Finalists by Week'
                        },
                        // subtitle: {
                        //     text: ''
                        // },
                        xAxis: {
                            labels: {
                                formatter: function() {
                                    return this.value; // clean, unformatted number for year
                                }
                            }
                        },
                        credits: {
                              enabled: false
                        },
                        yAxis: {
                            title: {
                                text: 'Number of Selections'
                            },
                            labels: {
                                formatter: function() {
                                    return this.value;
                                }
                            }
                        },
                        tooltip: {
                            pointFormat: '{series.name} picked <b>{point.y:,.0f}</b><br/> in week {point.x}'
                        },
                        plotOptions: {
                            area: {
                                pointStart: 1,
                                marker: {
                                    enabled: false,
                                    symbol: 'circle',
                                    radius: 2,
                                    states: {
                                        hover: {
                                            enabled: true
                                        }
                                    }
                                }
                            }
                        },
                        series: [{
                            name: 'Andi',
                            data: [3, 10, 12, 15, 18, 20, 21]
                        }, {
                            name: 'Renee',
                            data: [1, 3, 7, 12, 13, 15, 18]
                        }]
                    });
                });
            //$.get(URLS.GET_LEADERBOARD).done(function(data) {
                var data = [];
                var table = $('#leaderboard .data');
                // table.find('.dataRow').remove();
                // $.each(data, function(i, v) {
                //     v.score > 0 && table.append('<tr class="dataRow"><td>' + v.firstName + ' ' + v.lastName + '</td><td>' + v.score + '</td></tr>');
                // });
            //})
        }
    };

    this.goToJuanPablo = function() {
        if (isLoggedIn) {

            // Show main section, hide login section, hide other sections, show this section
            $('#login').hide();
            $('#main').show();
            $('section').hide();
            var element = $('#juanPabloWrapper').show();

            var contestant = cd.getContestantById(CONSTANTS.JUAN_PABLO_ID);

            var stats = element.find('.stats').empty();
            $.each(contestant.stats, function(i, v) {
                stats.append('<div class="stat"><span class="name">' + v.name + ':</span> ' + v.value + '</div>');
            });

            var questions = element.find('.questions').empty();
            $.each(contestant.questions, function(i, v) {
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