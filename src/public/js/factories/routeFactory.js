app.factory('routeFactory', ['$rootScope', '$location', 'EVENTS', 'ROUTES', 'authFactory', function($rootScope, $location, EVENTS, ROUTES, authFactory) {
    var routeFactory = {};

    routeFactory.validators = { '/' : function() { return true; }};
    routeFactory.validators[ROUTES.CHANGE_ALIAS] = function() {
        return !!authFactory.user;
    };
    routeFactory.validators[ROUTES.TEST] = function() {
        return !!authFactory.user;
    };
    routeFactory.validators[ROUTES.LOGIN] = function() {
        return !authFactory.user;
    };

    $rootScope.$on("$locationChangeStart", function(event, next, current) {
        console.log("location changing to:" + next);

        var nextRoute = next.substring(next.indexOf('#') + 1);
        if (routeFactory.validators[nextRoute] && routeFactory.validators[nextRoute]()) { return; }
        if (next === current) { routeFactory.goToHome(); return; }
        event.preventDefault();
    });

    $rootScope.$on(EVENTS.AUTHENTICATION.AUTHENTICATED, function() {
        $rootScope.appLoaded = true;
        var user = authFactory.user;
        if (!user.alias) {
            $location.path(ROUTES.CHANGE_ALIAS);
            return;
        }
        $location.path(ROUTES.TEST);
    });

    $rootScope.$on(EVENTS.AUTHENTICATION.SILENT_AUTHENTICATION_FAILED, function() {
        $location.path(ROUTES.LOGIN);
        $rootScope.appLoaded = true;
    });

    $rootScope.$on(EVENTS.AUTHENTICATION.LOGGED_OUT, function() {
        $location.path(ROUTES.LOGIN);
    });

    routeFactory.goToChangeAlias = function() {
        $location.path(ROUTES.CHANGE_ALIAS);
    };

    routeFactory.goToTest = function() {
        $location.path(ROUTES.TEST);
    };

    routeFactory.goToHome = function() {
        $location.path('/');
    };

    return routeFactory;
}]);