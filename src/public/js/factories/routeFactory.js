app.factory('routeFactory', ['$rootScope', '$location', 'EVENTS', 'ROUTES', 'authFactory', function($rootScope, $location, EVENTS, ROUTES, authFactory) {
    var routeFactory = {};

    routeFactory.state = {
        auth : false,
        silentAuthFail : false,
        contestantImages : false,
        staticImages : false,
        weeks : true
    };

    $rootScope.$watch(function() { return routeFactory.state; }, function(state) {
        if (state.auth && state.contestantImages && state.weeks && state.staticImages) {
            $rootScope.appLoaded = true;
        } else if (state.silentAuthFail && state.contestantImages && state.staticImages) {
            $rootScope.appLoaded = true;
        } else {
            $rootScope.appLoaded = false;
        }
    }, true);

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

    $rootScope.$on('$locationChangeStart', function(event, next, current) {
        console.log('Route changing to: ' + next);

        var nextRoute = next.substring(next.indexOf('#') + 1);
        if (routeFactory.validators[nextRoute] && routeFactory.validators[nextRoute]()) { return; }
        if (next === current) { routeFactory.goToHome(); return; }
        event.preventDefault();
    });

    $rootScope.$on(EVENTS.AUTHENTICATION.AUTHENTICATED, function() {
        var user = authFactory.user;
        if (!user.alias) {
            $location.path(ROUTES.CHANGE_ALIAS);
            return;
        }
        $location.path(ROUTES.TEST);
        routeFactory.state.auth = true;
    });

    $rootScope.$on(EVENTS.AUTHENTICATION.SILENT_AUTHENTICATION_FAILED, function() {
        $location.path(ROUTES.LOGIN);
        routeFactory.state.silentAuthFail = true;
    });

    $rootScope.$on(EVENTS.AUTHENTICATION.LOGGED_OUT, function() {
        $location.path(ROUTES.LOGIN);
    });

    $rootScope.$on(EVENTS.IMAGES.CONTESTANTS_LOADED, function() {
        routeFactory.state.contestantImages = true;
    });

    $rootScope.$on(EVENTS.IMAGES.STATIC_LOADED, function() {
        routeFactory.state.staticImages = true;
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