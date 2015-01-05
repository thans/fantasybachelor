app.factory('weeksFactory', ['$rootScope', 'EVENTS', 'backendFactory', 'authFactory', function($rootScope, EVENTS, backendFactory, authFactory) {
    var weeksFactory = {};

    weeksFactory.getCurrentWeek = function() {
        return _.find($rootScope.weeks, {isCurrentWeek : true});
    };

    weeksFactory.getCurrentWeekId = function() {
        var currentWeek = weeksFactory.getCurrentWeek();
        return currentWeek && currentWeek.id;
    };

    weeksFactory.getWeekById = function(weekId) {
        return _.find($rootScope.weeks, function(week) {
            return week.id === weekId;
        });
    };

    weeksFactory.updateWeekAttributes = function(week) {
        week.isBeforeSelectionOpen = moment().isBefore(week.openTime);
        week.isCurrentWeek = moment().isAfter(week.openTime) && moment().isBefore(week.scoresAvailableTime);
        week.isSelectionOpen = moment().isAfter(week.openTime) && moment().isBefore(week.closeTime);
        week.isShowInProgress = moment().isAfter(week.closeTime) && moment().isBefore(week.scoresAvailableTime);
        week.isScoresAvailable = moment().isAfter(week.scoresAvailableTime);
        week.millisToOpen = moment.duration(moment(week.openTime).diff(moment()));
        week.millisToClose = moment.duration(moment(week.closeTime).diff(moment()));
        week.millisToScoresAvailable = moment.duration(moment(week.scoresAvailableTime).diff(moment()));
    };

    $rootScope.$on(EVENTS.ALIAS.VALID, function() {
        backendFactory.loadWeeks(authFactory.user.id).success(function(weeksData) {
            _.each(weeksData, function(week) {
                weeksFactory.updateWeekAttributes(week);
                week.score = 0;
                _.each(week.selectedContestants, function(selectedContestant) {
                    week.remainingContestants = _.reject(week.remainingContestants, selectedContestant);
                    if (week.isScoresAvailable && !_.findWhere(week.eliminatedContestants, selectedContestant)) {
                        week.score += selectedContestant.multiplier;
                    }
                });
            });
            console.log(weeksData);
            $rootScope.weeks = weeksData;
            console.log('Week data loaded.');
            $rootScope.$broadcast(EVENTS.WEEKS.LOADED, weeksData);
        });
    });

    $rootScope.$on(EVENTS.AUTHENTICATION.LOGGED_OUT, function() {
        $rootScope.weeks = null;
    });

    return weeksFactory;
}]);