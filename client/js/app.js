var cd = new ContestantData();
var wd = new WeekData();
var navManager = new NavigationManager();
var bioModal = new BioModal('#bioModal');
var dropdown = new Dropdown().appendTo('#navigation');


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
var user;
function authChangeHandler(fbUser) {
    if (fbUser) {
        $.ajax({
            url: URLS.LOGIN_USER,
            type: 'POST',
            data: {
                fbId: fbUser.id,
                firstName: fbUser.first_name,
                lastName: fbUser.last_name,
                email: fbUser.email
            }
        }).done(function(data) {
            isLoggedIn = true;
            user = data;
            $.when(cd.load(user), wd.load(user)).then(function() {

                // Put weeks in navigation header
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
                dropdown.addDivider().addItem($('<li>Leaderboard</li>')).addItem($('<li>Meet Juan Pablo</li>'));

                // Put username in the top corner
                $('header .user').text(fbUser.name).hover(function() {
                    $(this).width($(this).width()).text('Log Out');
                }, function() {
                    if (fbUser && fbUser.name) {
                        $(this).width('auto').text(fbUser.name);
                    }
                });

                // Show user score
                $('#userScore').text(user.score + 'pts');

                // Show correct week
                wd.getCurrentWeekId(function(weekId) {
                    dropdown.setSelected(weekId);
                    navManager.goToWeek(weekId);
                    history.replaceState({func: 'goToWeek', data: weekId}, null, '#weekId=' + weekId);
                });
            });
        });
    } else {
        isLoggedIn = false;
        user = undefined;
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


