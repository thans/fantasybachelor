app.factory('backendFactory', ['$http', function($http) {
    var backendFactory = {};

    backendFactory.getUser = function() {
        return $http.get('/getUser');
    };

    backendFactory.setAlias = function(alias) {
        return $http.post('/setAlias', {
            alias : alias
        });
    };

    backendFactory.loadContestants = function() {
        return $http.get('/getContestants');
    };

    backendFactory.loadWeeks = function() {
        return $http.get('/getWeeks', {
            params: {
                now : new Date()
            }
        });
    };

    backendFactory.selectContestant = function(weekId, contestantId) {
        return $http.post('/selectContestant', {
            weekId : weekId,
            contestantId : contestantId
        });
    };

    backendFactory.removeContestant = function(weekId, contestantId) {
        return $http.post('/removeContestant', {
            weekId : weekId,
            contestantId : contestantId
        });
    };

    backendFactory.getLeaderboard = function() {
        return $http.get('/getLeaderboard');
    };

    return backendFactory;
}]);