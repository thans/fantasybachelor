app.factory('routeValidatorFactory', ['$rootScope', 'ROUTES', 'routeFactory', 'userFactory', 'contestantFactory', 'weeksFactory', function($rootScope, ROUTES, routeFactory, userFactory, contestantFactory, weeksFactory) {
    var routeValidatorFactory = {};

    routeValidatorFactory.validators = { '/' : function() { return true; }};
    routeValidatorFactory.validators[ROUTES.CHANGE_ALIAS] = function() {
        return !!userFactory.user;
    };
    routeValidatorFactory.validators[ROUTES.WEEK] = routeValidatorFactory.validators[ROUTES.WEEK_BASE] = function() {
        return !!userFactory.user && !!userFactory.user.alias && !!contestantFactory.contestants && !!weeksFactory.weeks;
    };
    routeValidatorFactory.validators[ROUTES.LOGIN] = function() {
        return !userFactory.user;
    };

    $rootScope.$on('$locationChangeStart', function(event, next, current) {
        console.log('Route changing to: ' + next);
    });

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (!current) { routeFactory.goToHome(); return; }
        if (!next.$$route) { return; }

        var nextRoute = next.$$route.originalPath;
        if (routeValidatorFactory.validators[nextRoute] && routeValidatorFactory.validators[nextRoute]()) { return; }
        console.log('Route change cancelled');
        event.preventDefault();
    });

    return routeValidatorFactory;
}]);
