app.config(['$routeProvider', 'ROUTES', function($routeProvider, ROUTES) {
    $routeProvider
        .when(ROUTES.LOGIN, {
            templateUrl : VIEWS_DIR + '/login',
            controller : 'loginController'
        })
        .when(ROUTES.LOGOUT, {
            templateUrl : VIEWS_DIR + '/login',
            controller : 'logoutController'
        })
        .when(ROUTES.CHANGE_NICKNAME, {
            templateUrl : VIEWS_DIR + '/nickname',
            controller : 'nicknameController'
        })
        .when(ROUTES.ROUND, {
            templateUrl : VIEWS_DIR + '/round',
            controller : 'roundController'
        })
        .when(ROUTES.ROUND_BASE, {
            templateUrl : VIEWS_DIR + '/round',
            controller : 'roundController'
        })
        .when(ROUTES.CREATE_LEAGUE, {
            templateUrl : VIEWS_DIR + '/createLeague',
            controller : 'createLeagueController'
        })
        .otherwise({
            redirectTo : function() {
                return ROUTES.ROUND_BASE;
            }
        });
}]);
