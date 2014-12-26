app.config(['$routeProvider', 'ROUTES', function($routeProvider, ROUTES) {
    $routeProvider
        .when(ROUTES.LOGIN, {
            templateUrl : 'html/login.html',
            controller : 'loginController'
        })
        .when(ROUTES.TEST, {
            templateUrl : 'html/test.html'
        })
        .when(ROUTES.CHANGE_ALIAS, {
            templateUrl : 'html/alias.html',
            controller : 'aliasController'
        })
        .when(ROUTES.WEEK, {
            templateUrl : 'html/week.html',
            controller : 'weekController'
        })
        .when(ROUTES.WEEK_BASE, {
            templateUrl : 'html/week.html',
            controller : 'weekController'
        })
        .otherwise({
            redirectTo : function() {
                return ROUTES.WEEK_BASE;
            }
        });
}]);