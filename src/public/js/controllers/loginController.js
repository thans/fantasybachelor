app.controller('loginController', ['$rootScope', '$scope', '$window', 'routeFactory', function($rootScope, $scope, $window, routeFactory) {
    $rootScope.showHeaderFooter = false;

    $scope.loginFacebook = routeFactory.goToFacebookLogin;

    $scope.loginGoogle = routeFactory.goToGoogleLogin;

    $scope.loginTwitter = routeFactory.goToTwitterLogin;

    $scope.loginReddit = routeFactory.goToRedditLogin;
}]);