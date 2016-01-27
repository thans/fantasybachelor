app.controller('roundController', ['$rootScope', '$scope', '$routeParams', '$interval', '$controller', 'EVENTS', 'CONTESTANT_MODAL_MODES', 'SEASON', 'roundsFactory', 'backendFactory', 'routeFactory', 'userFactory', 'contestantFactory', function($rootScope, $scope, $routeParams, $interval, $controller, EVENTS, CONTESTANT_MODAL_MODES, SEASON, roundsFactory, backendFactory, routeFactory, userFactory, contestantFactory) {
    console.log($routeParams);

    $rootScope.showHeaderFooter = true;
    $rootScope.viewLoaded = true;
    $scope.round = roundsFactory.getRoundById($routeParams.roundId) || roundsFactory.getCurrentRound();
    $rootScope.pageTitle = $scope.round.name;
    $scope.benImageUrl = 'https://resources.fantasybach.com/season:NJWJTpZ8x/headShots/Ben.png';
    $scope.user = userFactory.user;

    $rootScope.$watch(function() { return $scope.user; }, function(user) {
        if (!user) {
            delete $scope.picks;
            return;
        }
        $scope.picks = user.picks[$scope.round.id];
    });

    $rootScope.$watch(function() { return $rootScope.currentLeague; }, function(currentLeague) {
        if (currentLeague) {
            $scope.displayedLeague = currentLeague;
            return;
        }
        $scope.displayedLeague = {
            users : userFactory.topUsers,
            name : 'global'
        }
    });

    $scope.console = console;

    $scope.isPicked = function(contestantId) {
        return _.includes($scope.picks, contestantId);
    };

    $scope.isFull = function() {
        return Object.keys($scope.picks).length >= $scope.round.rosterSize;
    };

    $scope.$watch(function() { return $scope.isFull(); }, function(isFull) {
        $scope.collapsed = isFull;
    });

    $scope.collapseToggle = function() {
        $scope.collapsed = !$scope.collapsed;
    };

    $scope.isEliminated = function(contestantId) {
        return _.findWhere($scope.round.eliminatedContestants, { id : contestantId});
    };

    $scope.selectContestant = function(contestant, multiplier, role) {
        backendFactory.postPick($scope.round.id, contestant.id, role.id).then(function() {
            $scope.picks[role.id] = contestant.id;
        });
    };

    $scope.removeContestant = function(contestant, multiplier, role) {
        backendFactory.deletePick($scope.round.id, contestant.id, role.id).then(function() {
            delete $scope.picks[role.id];
        });
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
            delete $scope.timeRemainingInterval;
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

}]);
