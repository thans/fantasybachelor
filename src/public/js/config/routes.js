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
        .otherwise({
            redirectTo : function() {
                return '/';
            }
        });
}]);