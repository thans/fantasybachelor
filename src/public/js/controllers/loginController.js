app.controller('loginController', ['$rootScope', '$scope', 'facebookFactory', 'googlePlusFactory', function($rootScope, $scope, facebookFactory, googlePlusFactory) {
    $rootScope.showHeaderFooter = false;

    $scope.loginFacebook = function() {
        facebookFactory.login();
    };

    $scope.loginGooglePlus = function() {
        googlePlusFactory.login();
    };
}]);