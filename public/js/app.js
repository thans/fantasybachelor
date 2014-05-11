var cd = new ContestantData();
var wd = new WeekData();
var navManager = new NavigationManager();
var bioModal = new BioModal('#bioModal');
var dropdown = new Dropdown().appendTo('#navigation');
var grapher = new LineChart();

var isLoggedIn = false;
var user;
var fb;
function authChangeHandler(fbUser) {
    if (fbUser) {
        $.ajax({
            url: URLS.LOGIN_USER,
            type: 'POST',
            data: {
                fbId: fbUser.id,
                firstName: fbUser.first_name,
                lastName: fbUser.last_name
            }
        }).done(function(data) {
            isLoggedIn = true;
            user = data;
            $.when(cd.load(user), wd.load(user)).then(function() {

                // Put weeks in navigation header
                dropdown.clear();
                $.each(wd.getAll(), function(i, v) {
                    dropdown.addItem($('<li>')
                        .attr('data-id', v.id)
                        .addClass('left')
                        .toggleClass('first', i === 0)
                        .text(v.name)
                        .click(function() {
                            dropdown.setSelected(v.id);
                            navManager.goToWeek(v.id);
                            history.pushState({func: 'goToWeek', data: v.id}, null, '#weekId=' + v.id);
                        }));
                });
                dropdown
                    .addDivider()
                    .addItem(
                        $('<li>Leaderboard</li>')
                            .attr('data-id', 'leaderboard')
                            .click(function() {
                                dropdown.setSelected('leaderboard');
                                navManager.goToLeaderboard();
                                history.pushState({func: 'goToLeaderboard'}, null, '#leaderboard');
                            }))
                    .addItem(
                        $('<li>Statistics</li>')
                            .attr('data-id', 'statistics')
                            .click(function() {
                                dropdown.setSelected('statistics');
                                navManager.goToStatistics();
                                history.pushState({func: 'goToStatistics'}, null, '#statistics');
                            }))
                    .addItem(
                        $('<li>Meet Andi</li>')
                            .attr('data-id', 'theBach')
                            .click(function() {
                                dropdown.setSelected('theBach');
                                navManager.goToTheBach();
                                history.pushState({func: 'goToTheBach'}, null, '#meetTheBach');
                            }));

                // Put username in the top corner
                $('header .user').text(fbUser.name).hover(function() {
                    $(this).width($(this).width()).text('Log Out');
                }, function() {
                    if (fbUser && fbUser.name) {
                        $(this).width('auto').text(fbUser.name);
                    }
                });

                // Setup how it works page
                $('#howItWorksButton').click(function() {
                    navManager.goToHowItWorks();
                    history.replaceState({func: 'goToHowItWorks'}, null, '#howItWorks');
                });
                $('#howItWorks .gettingStarted').click(function() {
                    var currentWeekId = wd.getCurrentWeek().id;
                    navManager.goToWeek(currentWeekId);
                    history.replaceState({func: 'goToWeek', data: currentWeekId}, null, '#weekId=' + currentWeekId);
                });

                // Show user score
                $('#userScore').text(user.score + 'pts');

                // Show correct week
                var currentWeekId = wd.getCurrentWeek().id;
                dropdown.setSelected(currentWeekId);
                navManager.goToWeek(currentWeekId);
                history.replaceState({func: 'goToWeek', data: currentWeekId}, null, '#weekId=' + currentWeekId);
            });
        });
    } else {
        isLoggedIn = false;
        user = undefined;
        navManager.goToLogin();
        history.pushState({func: 'goToLogin'}, null, '#login');
    }
}


if (window.location.hash === '#guest') {
    fb = new FacebookGuest();
    fb.login(authChangeHandler);
} else {
    fb = new Facebook().loadSdk(function() {
        fb.silentLogin(authChangeHandler);
    });
}

$('#login .loginWithFacebook').click(function() {
    fb.login(authChangeHandler);
    $(this).addClass('disabled');
});

$('header .user').click(function() {
    fb.logout(authChangeHandler);
    //authChangeHandler(); // Log out without logging out of FB
});

$(window).bind('popstate', function() {
    console.log('POP: ');
    console.log(history.state);
    console.log(' ');
    history.state && history.state.func && navManager[history.state.func](history.state.data);
});
