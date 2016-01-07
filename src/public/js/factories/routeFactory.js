app.factory('routeFactory', ['$rootScope', '$window', '$location', 'ROUTES', function($rootScope, $window, $location, ROUTES) {
    var routeFactory = {};

    routeFactory.goToChangeNickname = function() {
        $rootScope.appLoaded = true;
        $location.path(ROUTES.CHANGE_NICKNAME);
    };

    routeFactory.goToTest = function() {
        $location.path(ROUTES.TEST);
    };

    routeFactory.goToRound = function(roundId) {
        $location.path(ROUTES.ROUND_BASE + (roundId || ''));
    };

    routeFactory.goToLogin = function() {
        $rootScope.appLoaded = true;
        $location.path(ROUTES.LOGIN);
    };

    routeFactory.goToHome = function() {
        $location.path('/');
    };

    routeFactory.goToLogout = function() {
        $location.path(ROUTES.LOGOUT);
    };

    routeFactory.goToCreateLeague = function() {
        $location.path(ROUTES.CREATE_LEAGUE);
    };

    return routeFactory;
}]);
