app.factory('roundsFactory', ['$rootScope', '$window', 'SEASON', 'backendFactory', 'contestantFactory', 'rolesFactory', function($rootScope, $window, SEASON, backendFactory, contestantFactory, rolesFactory) {
    var roundsFactory = {};

    roundsFactory.loadRounds = function() {
        backendFactory.getRounds().then(function(rounds) {
            console.log(rounds);
            roundsFactory.rounds = rounds;
            _.each(roundsFactory.rounds, function(round) {
                roundsFactory.updateRoundAttributes(round);
            });
            roundsFactory._mapContestants();
            roundsFactory._mapRoles();
        });
    };

    roundsFactory.getCurrentRound = function() {
        return _.find(roundsFactory.rounds, {isCurrentRound : true});
    };

    roundsFactory.getCurrentRoundId = function() {
        var currentRound = roundsFactory.getCurrentRound();
        return currentRound && currentRound.id;
    };

    roundsFactory.getRoundById = function(roundId) {
        return _.find(roundsFactory.rounds, function(round) {
            return round.id === roundId;
        });
    };

    roundsFactory.updateRoundAttributes = function(round) {
        round.isBeforeSelectionOpen = moment().isBefore(round.startVoteLocalDateTime);
        round.isCurrentRound = round.id === "round:Vk6kVRWIl"; // moment().isAfter(round.startVoteLocalDateTime) && moment().isBefore(round.roundEndLocalDateTime);
        round.isSelectionOpen = moment().isAfter(round.startVoteLocalDateTime) && moment().isBefore(round.endVoteLocalDateTime);
        round.isShowInProgress = moment().isAfter(round.endVoteLocalDateTime) && moment().isBefore(round.roundEndLocalDateTime);
        var oldIsScoresAvailable = round.isScoresAvailable;
        round.isScoresAvailable = moment().isAfter(round.roundEndLocalDateTime);
        if (oldIsScoresAvailable !== undefined && !oldIsScoresAvailable && round.isScoresAvailable) {
            $window.location.reload();
        }
        round.millisToOpen = moment.duration(moment(round.startVoteLocalDateTime).diff(moment()));
        round.millisToClose = moment.duration(moment(round.endVoteLocalDateTime).diff(moment()));
        round.millisToScoresAvailable = moment.duration(moment(round.roundEndLocalDateTime).diff(moment()));
    };

    roundsFactory._mapRoles = function() {
        _.each(roundsFactory.rounds, function(round) {
            round.availableRoles = _.map(round.availableRoleIds, function(roleId) {
                return rolesFactory.findRoleById(roleId);
            });
        });
    };

    roundsFactory._mapContestants = function() {
        _.each(roundsFactory.rounds, function(round) {
            round.eligibleContestants = _.map(round.eligibleContestantIds, function(contestantId) {
                return contestantFactory.findContestantById(contestantId);
            });
            round.eliminatedContestants = _.map(round.eliminatedContestantIds, function(contestantId) {
                return contestantFactory.findContestantById(contestantId);
            });
        });
    };

    $rootScope.$watch(function() { return roundsFactory.rounds; }, function(rounds) {
        if (!rounds) { return; }
        _.each(rounds, function(round) {
            if (!round.eligibleContestants) { return; }
            round.eligibleContestants = _.sortBy(round.eligibleContestants, 'name');
        });
    }, true);

    $rootScope.$watch(function() { return contestantFactory.contestants }, function() {
        roundsFactory._mapContestants();
    });

    $rootScope.$watch(function() { return rolesFactory.roles }, function() {
        roundsFactory._mapRoles();
    });

    return roundsFactory;
}]);
