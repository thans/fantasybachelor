var app = angular.module('FantasyBach', ['ngRoute', 'ngAnimate', 'ngTouch']);

app.run(['$rootScope', '$q', 'userFactory', 'roundsFactory', 'rolesFactory', 'contestantFactory', 'routeFactory', 'topUsersFactory', 'routeValidatorFactory', 'unauthorizedInterceptor', function($rootScope, $q, userFactory, roundsFactory, rolesFactory, contestantFactory, routeFactory, topUsersFactory, routeValidatorFactory, unauthorizedInterceptor) {
    $rootScope.$watch(function() {
        return roundsFactory.rounds && rolesFactory.roles && contestantFactory.contestants && userFactory.user && topUsersFactory.topUsers && userFactory.user.groupData && userFactory.user.groups && Object.keys(userFactory.user.groupData).length == userFactory.user.groups.length;
    }, function(loaded) {
        if (!loaded || $rootScope.appLoaded) { return; }
        console.log('All loaded and good to go!');
        $rootScope.appLoaded = true;
        if (!userFactory.user.nickname) {
            return routeFactory.goToChangeNickname();
        }
        routeFactory.goToRound();
    });
}]);

app.run(function() {
    FastClick.attach(document.body);
});

app.run(['$rootScope', 'EVENTS', 'SEASON', 'facebookFactory', 'routeFactory', 'backendFactory', function($rootScope, EVENTS, SEASON, facebookFactory, routeFactory, backendFactory) {

    $rootScope.$watch(function() { return facebookFactory.accessToken; }, function(accessToken) {
        if (!facebookFactory.isInitialized) { return; }
        if (!accessToken) {
            return routeFactory.goToLogin();
        }
        backendFactory.login({ token : accessToken }).then(function() {
            $rootScope.isAuthenticated = true;
            $rootScope.$apply();
        });
    });

    var handleLoginToken = function(loginToken) {
        console.log('loginToken');
        backendFactory.login({token : loginToken}).then(function(data) {
            backendFactory.getCurrentUser({ seasonId : SEASON.CURRENT_SEASON_ID }).then(function(result) {
                console.log(result);
                if (!result.data.nickname) {
                    routeFactory.goToLogin();
                }
            })
        })
    };

    (function(d){
        // load the Facebook javascript SDK

        var js,
            id = 'facebook-jssdk',
            ref = d.getElementsByTagName('script')[0];

        if (d.getElementById(id)) {
            return;
        }

        js = d.createElement('script');
        js.id = id;
        js.async = true;
        js.src = "//connect.facebook.net/en_US/sdk.js";

        ref.parentNode.insertBefore(js, ref);

    }(document));
}]);
