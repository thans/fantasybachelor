app.factory('userFactory', ['$rootScope', 'backendFactory', 'roundsFactory', function($rootScope, backendFactory, roundsFactory) {
    var userFactory = {};

    userFactory.loadCurrentUser = function() {
        backendFactory.getCurrentUser().then(function(user) {
            console.log(user);
            userFactory.user = user;
        });
    };

    userFactory.loadTopUsers = function() {
        backendFactory.getTopUsers().then(function(topUsers) {
            console.log(topUsers);
            userFactory.topUsers = topUsers;
        });
    };

    userFactory.setNickname = function(nickname) {
        return backendFactory.postNickname(nickname).then(function() {
            userFactory.user.nickname = nickname;
            return nickname;
        });
    };

    $rootScope.$watchCollection(function() { return userFactory.user; }, function(user) {
        if (!user) { return; }
        user.displayName = user.nickname || user.name;
    });

    $rootScope.$watchCollection(function() { return userFactory.topUsers; }, function(topUsers) {
        if (!topUsers) { return; }
        _.each(topUsers, function(user) {
            user.displayName = user.nickname || user.name;
        });
    });

    var calculateMultipliers = function(user, rounds) {
        var multipliers = {};
        var roundMultipliers = {};
        _.each(rounds, function(round) {
            multipliers[round.id] = roundMultipliers;
            if (round.isCurrentRound) { return false; }
            var nextRoundMultipliers = {};

            var roundPicks = user.picks && user.picks[round.id];
            _.each(roundPicks, function(contestantId) {
                var multiplier = (roundMultipliers[contestantId] || 1) + 1;
                multiplier = Math.min(multiplier, round.maximumMultiplier);
                nextRoundMultipliers[contestantId] = multiplier;
            });

            roundMultipliers = nextRoundMultipliers;
        });
        return multipliers;
    };

    $rootScope.$watch(function() {
        return {
            user : userFactory.user,
            topUsers : userFactory.topUsers,
            rounds : roundsFactory.rounds
        }
    }, function(deps) {
        if (!deps.user || !deps.topUsers || !deps.rounds) { return; }
        deps.user.multipliers = calculateMultipliers(deps.user, deps.rounds);
        _.each(deps.topUsers, function(topUser) {
            topUser.multipliers = calculateMultipliers(deps.user, deps.rounds);
        });
    }, true);

    return userFactory;
}]);
