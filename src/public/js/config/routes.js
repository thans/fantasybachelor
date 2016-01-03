app.config(['$routeProvider', 'ROUTES', function($routeProvider, ROUTES) {
    $routeProvider
        .when(ROUTES.LOGIN, {
            templateUrl : 'view/login',
            controller : 'loginController'
        })
        .when(ROUTES.CHANGE_NICKNAME, {
            templateUrl : 'view/nickname',
            controller : 'nicknameController'
        })
        .when(ROUTES.ROUND, {
            templateUrl : 'view/round',
            controller : 'roundController'
        })
        .when(ROUTES.ROUND_BASE, {
            templateUrl : 'view/round',
            controller : 'roundController'
        })
        .when(ROUTES.LEADERBOARD, {
            templateUrl : 'view/leaderboard',
            controller : 'leaderboardController'
        })
        .when(ROUTES.CREATE_LEAGUE, {
            templateUrl : 'view/createLeague',
            controller : 'createLeagueController'
        })
        .otherwise({
            redirectTo : function() {
                return ROUTES.ROUND_BASE;
            }
        });
}]);
