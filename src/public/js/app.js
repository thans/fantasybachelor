var app = angular.module('FantasyBach', ['ngRoute', 'ngAnimate', 'ngTouch']);

app.run(['$rootScope', '$q', 'userFactory', 'roundsFactory', 'rolesFactory', 'contestantFactory', 'routeFactory', 'routeValidatorFactory', 'unauthorizedInterceptor', function($rootScope, $q, userFactory, roundsFactory, rolesFactory, contestantFactory, routeFactory, routeValidatorFactory, unauthorizedInterceptor) {
    $rootScope.$watch(function() {
        return roundsFactory.rounds && rolesFactory.roles && contestantFactory.contestants && userFactory.user && userFactory.topUsers;
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

app.run(['$rootScope', '$interval', 'EVENTS', 'SEASON', 'facebookFactory', 'routeFactory', 'backendFactory', 'userFactory', 'contestantFactory', 'roundsFactory', 'rolesFactory', function($rootScope, $interval, EVENTS, SEASON, facebookFactory, routeFactory, backendFactory, userFactory, contestantFactory, roundsFactory, rolesFactory) {

    $rootScope.$watch(function() { return facebookFactory.accessToken; }, function(accessToken) {
        if (!facebookFactory.isInitialized) { return; }
        if (!accessToken) {
            return routeFactory.goToLogin();
        }
        backendFactory.login(accessToken).then(function() {
            $rootScope.isAuthenticated = true;
        });
    });

    $rootScope.$watch(function() { return $rootScope.isAuthenticated; }, function(isAuthenticated) {
        if (!isAuthenticated) { return; }
        userFactory.loadCurrentUser();
        userFactory.loadTopUsers();
        contestantFactory.loadContestants();
        roundsFactory.loadRounds();
        rolesFactory.loadRoles();
    });

    $interval(function() {
        facebookFactory.checkAuthentication(true);
    }, 4 * 60 * 1000);

    $interval(function() {
        if (!$rootScope.isAuthenticated) { return; }
        facebookFactory.checkAuthentication(true);
        userFactory.loadCurrentUser();
        userFactory.loadTopUsers();
        contestantFactory.loadContestants();
        roundsFactory.loadRounds();
    }, 2 * 60 * 1000);
}]);
