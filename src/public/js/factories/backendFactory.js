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

    backendFactory.loadContestants = function() {
        return $http.get('/getContestants');
    };

    backendFactory.loadWeeks = function(userId) {
        return $http.get('/getWeeks', {
            params : {
                userId : userId
            }
        });
    };

    backendFactory.selectContestant = function(userId, weekId, contestantId) {
        return $http.post('/selectContestant', {
            userId : userId,
            weekId : weekId,
            contestantId : contestantId
        });
    };

    backendFactory.removeContestant = function(userId, weekId, contestantId) {
        return $http.post('/removeContestant', {
            userId : userId,
            weekId : weekId,
            contestantId : contestantId
        });
    };

    return backendFactory;
}]);