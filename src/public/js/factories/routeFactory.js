app.factory('routeFactory', ['$rootScope', '$location', 'EVENTS', 'ROUTES', 'authFactory', function($rootScope, $location, EVENTS, ROUTES, authFactory) {
    var routeFactory = {};

    routeFactory.state = {
        auth : false,
        silentAuthFail : false,
        contestantImages : false,
        staticImages : false,
        weeks : false,
        alias : false
    };

    $rootScope.$watch(function() { return routeFactory.state; }, function(state) {
        if (state.auth && state.contestantImages && state.staticImages && (!state.alias || state.weeks)) {
            $rootScope.appLoaded = true;
            console.log('App loaded');
        } else if (state.silentAuthFail && state.contestantImages && state.staticImages) {
            $rootScope.appLoaded = true;
            console.log('App loaded');
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
    routeFactory.validators[ROUTES.WEEK] = routeFactory.validators[ROUTES.WEEK_BASE] = function() {
        return !!authFactory.user && !!$rootScope.weeks;
    };
    routeFactory.validators[ROUTES.LOGIN] = function() {
        return !authFactory.user;
    };

    $rootScope.$on('$locationChangeStart', function(event, next, current) {
        console.log('Route changing to: ' + next);
    });

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (!current) { routeFactory.goToHome(); return; }
        if (!next.$$route) { return; }

        var nextRoute = next.$$route.originalPath;
        if (routeFactory.validators[nextRoute] && routeFactory.validators[nextRoute]()) { return; }
        console.log('Route change cancelled');
        event.preventDefault();
    });

    $rootScope.$on(EVENTS.AUTHENTICATION.AUTHENTICATED, function() {
        routeFactory.state.auth = true;
        if (!authFactory.user.alias) {
            routeFactory.goToChangeAlias();
            return;
        }
        $rootScope.$broadcast(EVENTS.ALIAS.VALID);
    });

    $rootScope.$on(EVENTS.AUTHENTICATION.SILENT_AUTHENTICATION_FAILED, function() {
        routeFactory.goToLogin();
        routeFactory.state.silentAuthFail = true;
    });

    $rootScope.$on(EVENTS.AUTHENTICATION.LOGGED_OUT, function() {
        routeFactory.goToLogin();
    });

    $rootScope.$on(EVENTS.IMAGES.CONTESTANTS_LOADED, function() {
        routeFactory.state.contestantImages = true;
    });

    $rootScope.$on(EVENTS.IMAGES.STATIC_LOADED, function() {
        routeFactory.state.staticImages = true;
    });

    $rootScope.$on(EVENTS.WEEKS.LOADED, function() {
        routeFactory.state.weeks = true;
        routeFactory.goToWeek();
    });

    $rootScope.$on(EVENTS.ALIAS.VALID, function() {
        routeFactory.state.alias = true;
    });

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
        $location.path(ROUTES.LOGIN);
    };

    routeFactory.goToHome = function() {
        $location.path('/');
    };

    return routeFactory;
}]);