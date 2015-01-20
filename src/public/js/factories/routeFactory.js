app.factory('routeFactory', ['$rootScope', '$window', '$location', 'ROUTES', function($rootScope, $window, $location, ROUTES) {
    var routeFactory = {};

    routeFactory.goToChangeAlias = function() {
        $location.path(ROUTES.CHANGE_ALIAS);
    };

    routeFactory.goToTest = function() {
        $location.path(ROUTES.TEST);
    };

    routeFactory.goToWeek = function(weekId) {
        $location.path(ROUTES.WEEK_BASE + (weekId || ''));
    };

    routeFactory.goToLogin = function() {
        // Copied in unauthorizedInterceptor
        $rootScope.appLoaded = true;
        $location.path(ROUTES.LOGIN);
    };

    routeFactory.goToHome = function() {
        $location.path('/');
    };

    routeFactory.goToLeaderboard = function() {
        $location.path(ROUTES.LEADERBOARD);
    };

    routeFactory.goToFacebookLogin = function() {
        $window.location.href = ROUTES.FACEBOOK_LOGIN;
    };

    routeFactory.goToGoogleLogin = function() {
        $window.location.href = ROUTES.GOOGLE_LOGIN;
    };

    routeFactory.goToTwitterLogin = function() {
        $window.location.href = ROUTES.TWITTER_LOGIN;
    };

    routeFactory.goToRedditLogin = function() {
        $window.location.href = ROUTES.REDDIT_LOGIN;
    };

    routeFactory.goToLogout = function() {
        $window.location.href = ROUTES.LOGOUT;
    };

    return routeFactory;
}]);