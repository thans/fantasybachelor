app.controller('loginController', ['$scope', 'facebookFactory', 'googlePlusFactory', 'authFactory', function($scope, facebookFactory, googlePlusFactory, authFactory) {
    $scope.loginFacebook = function() {
        facebookFactory.login();
    };

    $scope.loginGooglePlus = function() {
        googlePlusFactory.login();
    };
}]);