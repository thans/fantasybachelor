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

    $rootScope.$on(EVENTS.ALIAS.VALID, function() {
        backendFactory.loadWeeks(authFactory.user.id).success(function(weeksData) {
            _.each(weeksData, function(week) {
                week.isCurrentWeek = moment().isAfter(week.openTime) && moment().isBefore(week.scoresAvailableTime);
                week.isSelectionOpen = moment().isAfter(week.openTime) && moment().isBefore(week.closeTime);
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