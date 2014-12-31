app.controller('weekController', ['$rootScope', '$scope', '$routeParams', 'EVENTS', 'CONTESTANT_MODAL_MODES', 'weeksFactory', 'backendFactory', function($rootScope, $scope, $routeParams, EVENTS, CONTESTANT_MODAL_MODES, weeksFactory, backendFactory) {
    console.log($routeParams);

    $rootScope.showHeaderFooter = true;
    $scope.week = weeksFactory.getWeekById(parseInt($routeParams.weekId)) || weeksFactory.getCurrentWeek();
    $scope.selectionRange = _.range(0, $scope.week.numberOfSelections);

    $scope.selectContestant = function(contestant, multiplier) {
        var contestantObject = {
            id : contestant.id,
            multiplier : multiplier
        };
        $scope.week.selectedContestants.push(contestantObject);
        $scope.week.remainingContestants = _.reject($scope.week.remainingContestants, contestantObject);
        backendFactory.selectContestant($scope.user.id, $scope.week.id, contestant.id);
    };

    $scope.removeContestant = function(contestant, multiplier) {
        var contestantObject = {
            id : contestant.id,
            multiplier : multiplier
        };
        $scope.week.selectedContestants = _.reject($scope.week.selectedContestants, contestantObject);
        $scope.week.remainingContestants.push(contestantObject);
        backendFactory.removeContestant($scope.user.id, $scope.week.id, contestant.id);
    };

    $scope.selectedContestantClicked = function(contestant, multiplier) {
        var mode;
        if (!$scope.week.isSelectionOpen) {
            mode = CONTESTANT_MODAL_MODES.SELECTION_CLOSED;
        } else {
            mode = CONTESTANT_MODAL_MODES.REMOVABLE;
        }
        $scope.$emit(EVENTS.CONTESTANT_MODAL.SHOW, {
            mode : mode,
            contestant : contestant,
            multiplier : multiplier,
            callback : function() {
                $scope.removeContestant(contestant, multiplier);
            }
        })
    };

    $scope.remainingContestantClicked = function(contestant, multiplier) {
        var mode;
        if (!$scope.week.isSelectionOpen) {
            mode = CONTESTANT_MODAL_MODES.SELECTION_CLOSED;
        } else if ($scope.week.selectedContestants.length < $scope.week.numberOfSelections) {
            mode = CONTESTANT_MODAL_MODES.CHOOSABLE;
        } else {
            mode = CONTESTANT_MODAL_MODES.SELECTION_FULL;
        }
        $scope.$emit(EVENTS.CONTESTANT_MODAL.SHOW, {
            mode : mode,
            contestant : contestant,
            multiplier : multiplier,
            callback : function() {
                $scope.selectContestant(contestant, multiplier);
            }
        })
    };
}]);