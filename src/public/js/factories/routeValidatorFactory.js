app.factory('routeValidatorFactory', ['$rootScope', 'ROUTES', 'routeFactory', 'userFactory', 'contestantFactory', 'roundsFactory', 'rolesFactory', function($rootScope, ROUTES, routeFactory, userFactory, contestantFactory, roundsFactory, rolesFactory) {
    var routeValidatorFactory = {};

    routeValidatorFactory.validators = { '/' : function() { return true; }};
    routeValidatorFactory.validators[ROUTES.CHANGE_NICKNAME] =
    routeValidatorFactory.validators[ROUTES.LEADERBOARD] = function() {
        return !!userFactory.user;
    };
    routeValidatorFactory.validators[ROUTES.ROUND] =
    routeValidatorFactory.validators[ROUTES.ROUND_BASE] =
    routeValidatorFactory.validators[ROUTES.CREATE_LEAGUE] = function() {
        return !!userFactory.user && !!userFactory.user.nickname && !!contestantFactory.contestants && !!roundsFactory.rounds && !!rolesFactory.roles;
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
