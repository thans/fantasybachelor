app.factory('backendFactory', ['$q', '$rootScope', 'SEASON', function($q, $rootScope, SEASON) {
    var backendSdk = new FantasyBachSdk();

    var backendFactory = {};

    var mapToSdk = function(sdkFunction, params, body, resultMapper) {
        return $q(function(resolve, reject) {
            sdkFunction.call(backendSdk, params || {}, body || {}).then(function(result) {
                var mappedResult = result.data;
                if (resultMapper) {
                    mappedResult = resultMapper(result);
                }
                resolve(mappedResult);
                $rootScope.$apply();
            }).catch(function(err) {
                reject(err);
                $rootScope.$apply();
            });
        });
    };

    backendFactory.login = function(fbAccessToken) {
        return mapToSdk(backendSdk.login, { token : fbAccessToken });
    };

    backendFactory.getCurrentUser = function() {
        return mapToSdk(backendSdk.getCurrentUser, { seasonId : SEASON.CURRENT_SEASON_ID });
    };

    backendFactory.getContestants = function() {
        return mapToSdk(backendSdk.getContestants, { seasonId : SEASON.CURRENT_SEASON_ID });
    };

    backendFactory.getRoles = function() {
        return mapToSdk(backendSdk.getRoles, { seasonId : SEASON.CURRENT_SEASON_ID });
    };

    backendFactory.getRounds = function() {
        return mapToSdk(backendSdk.getRounds, { seasonId : SEASON.CURRENT_SEASON_ID });
    };

    backendFactory.getTopUsers = function() {
        return mapToSdk(backendSdk.getTopUsers, { seasonId : SEASON.CURRENT_SEASON_ID });
    };

    backendFactory.postNickname = function(nickname) {
        return mapToSdk(backendSdk.postNickname, {}, { nickname : nickname });
    };

    backendFactory.postPick = function(roundId, contestantId, roleId) {
        return mapToSdk(backendSdk.postPick, { seasonId : SEASON.CURRENT_SEASON_ID, roundId : roundId }, { contestantId : contestantId, roleId : roleId });
    };

    backendFactory.deletePick = function(roundId, contestantId, roleId) {
        return mapToSdk(backendSdk.deletePick, { seasonId : SEASON.CURRENT_SEASON_ID, roundId : roundId }, { contestantId : contestantId, roleId : roleId });
    };

    return backendFactory;
}]);
