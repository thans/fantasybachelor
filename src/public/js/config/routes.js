app.config(['$routeProvider', 'ROUTES', function($routeProvider, ROUTES) {
    $routeProvider
        .when(ROUTES.LOGIN, {
            templateUrl : 'view/login',
            controller : 'loginController'
        })
        .when(ROUTES.CHANGE_ALIAS, {
            templateUrl : 'view/alias',
            controller : 'aliasController'
        })
        .when(ROUTES.WEEK, {
            templateUrl : 'view/week',
            controller : 'weekController'
        })
        .when(ROUTES.WEEK_BASE, {
            templateUrl : 'view/week',
            controller : 'weekController'
        })
        .when(ROUTES.LEADERBOARD, {
            templateUrl : 'view/leaderboard',
            controller : 'leaderboardController'
        })
        .otherwise({
            redirectTo : function() {
                return ROUTES.WEEK_BASE;
            }
        });
}]);