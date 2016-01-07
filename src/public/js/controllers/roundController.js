app.controller('roundController', ['$rootScope', '$scope', '$routeParams', '$interval', '$controller', 'EVENTS', 'CONTESTANT_MODAL_MODES', 'SEASON', 'roundsFactory', 'backendFactory', 'routeFactory', 'userFactory', 'contestantFactory', 'topUsersFactory', function($rootScope, $scope, $routeParams, $interval, $controller, EVENTS, CONTESTANT_MODAL_MODES, SEASON, roundsFactory, backendFactory, routeFactory, userFactory, contestantFactory, topUsersFactory) {
    console.log($routeParams);

    $rootScope.showHeaderFooter = true;
    $rootScope.viewLoaded = true;
    $scope.round = roundsFactory.getRoundById($routeParams.roundId) || roundsFactory.getCurrentRound();
    $rootScope.pageTitle = $scope.round.name;
    $scope.ben = 'https://resources.fantasybach.com/season:NJWJTpZ8x/headShots/Ben.png';

    $scope.picks = _.object(_.map(userFactory.user.picks[$scope.round.id], function(contestantId, roleId) {
        return [roleId, contestantFactory.findContestantById(contestantId)];
    }));

    _.each($scope.picks, function(contestant) {
        $scope.round.eligibleContestants = _.reject($scope.round.eligibleContestants, contestant);
    });

    $rootScope.$watch(function() { return $rootScope.currentLeague; }, function(currentLeague) {
        if (currentLeague) {
            $scope.displayedLeague = currentLeague;
            return;
        }
        $scope.displayedLeague = {
            users : topUsersFactory.topUsers,
            name : 'global'
        }
    });

    $rootScope.$watchCollection(function() { return $scope.round.eligibleContestants; }, function(eligibleContestants) {
        if (!eligibleContestants) { return; }
        $scope.round.eligibleContestants = _.sortBy($scope.round.eligibleContestants, 'name');
    });

    $scope.isFull = function() {
        return Object.keys($scope.picks).length >= $scope.round.rosterSize;
    };
    $scope.collapsed = $scope.isFull();

    $scope.collapseToggle = function() {
        $scope.collapsed = !$scope.collapsed;
    };

    $scope.isEliminated = function(contestant) {
        if (contestant && contestant.id) { contestant = contestant.id }
        return _.findWhere($scope.round.eliminatedContestants, { id : contestant});
    };

    $scope.selectContestant = function(contestant, multiplier, role) {
        $scope.picks[role.id] = contestant;
        $scope.round.eligibleContestants = _.reject($scope.round.eligibleContestants, contestant);
        backendFactory.postPick({ seasonId : SEASON.CURRENT_SEASON_ID, roundId : $scope.round.id }, { contestantId : contestant.id, roleId : role.id });
        if ($scope.isFull()) {
            $scope.collapsed = true;
        }
    };

    $scope.removeContestant = function(contestant, multiplier, role) {
        delete $scope.picks[role.id];
        $scope.round.eligibleContestants.push(contestant);
        backendFactory.deletePick({ seasonId : SEASON.CURRENT_SEASON_ID, roundId : $scope.round.id }, { contestantId : contestant.id, roleId : role.id });
        $scope.collapsed = false;
    };

    $scope.showSelectedContestantBio = function(contestant, multiplier, role) {
        var mode;
        if (!$scope.round.isSelectionOpen) {
            mode = CONTESTANT_MODAL_MODES.SELECTION_CLOSED;
        } else {
            mode = CONTESTANT_MODAL_MODES.REMOVABLE;
        }
        $scope.$emit(EVENTS.CONTESTANT_MODAL.SHOW, {
            mode : mode,
            contestant : contestant,
            multiplier : multiplier,
            callback : function() {
                $scope.removeContestant(contestant, multiplier, role);
            }
        })
    };

    $scope.showEligibleContestantBio = function(contestant, multiplier) {
        var mode;
        var roles;
        if (!$scope.round.isSelectionOpen) {
            mode = CONTESTANT_MODAL_MODES.SELECTION_CLOSED;
        } else if (!$scope.isFull()) {
            mode = CONTESTANT_MODAL_MODES.CHOOSABLE;
            roles = _.each(_.clone($scope.round.availableRoles, true), function(role) {
                role.enabled = !$scope.picks[role.id];
            });
        } else {
            mode = CONTESTANT_MODAL_MODES.SELECTION_FULL;
        }
        $scope.$emit(EVENTS.CONTESTANT_MODAL.SHOW, {
            mode : mode,
            contestant : contestant,
            multiplier : multiplier,
            roles : roles,
            callback : function(role) {
                $scope.selectContestant(contestant, multiplier, role);
            }
        })
    };

    $scope.updateTimeRemaining = function() {
        roundsFactory.updateRoundAttributes($scope.round);
    };

    $scope.timeRemainingInterval = $interval($scope.updateTimeRemaining, 1000);

    $scope.$on('$destroy', function() {
        if ($scope.timeRemainingInterval) {
            $interval.cancel($scope.timeRemainingInterval);
            $scope.timeRemainingInterval = undefined;
        }
    });

    $scope.goToCurrentRound = function() {
        routeFactory.goToRound();
    };

    $scope.showLeagueModal = function() {
        $scope.$emit(EVENTS.LEAGUE_MODAL.SHOW, {
            leagues : _.map(userFactory.user.groupData, function(data, id) {
                data.id = id;
                return data;
            }),
            callback : function(league) {
                $rootScope.currentLeague = league;
            },
            onCreateLeague : function() {
                routeFactory.goToCreateLeague();
            }
        })
    };

    //multipliers.roundId.contestantId = value
    var calculateMultipliers = function(user, rounds, contestants, currentRound) {
        var multipliers = {};
        var roundMultipliers = {};
        _.each(rounds, function(round, index) {
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
        return multipliers[currentRound.id];
    };

    $scope.multipliers = calculateMultipliers(userFactory.user, roundsFactory.rounds, contestantFactory.contestants, $scope.round);

}]);
