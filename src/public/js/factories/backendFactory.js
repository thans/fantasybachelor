app.factory('backendFactory', ['$http', function($http) {
    var backendFactory = {};

    backendFactory.loginUser = function(userData) {
        return $http.post('/loginUser', userData);
    };

    backendFactory.setAlias = function(userId, alias) {
        return $http.post('/setAlias', {
            userId : userId,
            alias : alias
        });
    };

    return backendFactory;
}]);