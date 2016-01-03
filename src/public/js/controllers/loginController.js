app.controller('loginController', ['$rootScope', '$scope', '$window', 'routeFactory', 'facebookFactory', function($rootScope, $scope, $window, routeFactory, facebookFactory) {
    $rootScope.showHeaderFooter = false;
    $rootScope.pageTitle = 'login';
    $rootScope.viewLoaded = true;


    $scope.loginFacebook = function() {
        facebookFactory.login();
    };
}]);
