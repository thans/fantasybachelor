var WeekData = function() {
    var weekData;

    this.getAll = function() {
        return weekData;
    }

    this.load = function(user, callback) {
        return $.get(URLS.GET_WEEKS, {userId: user.id}).done(function(results) {
            weekData = results;
            callback && callback();
        });
    };

    this.getCurrentWeek = function() {
        var currentWeek = false;
        $.each(weekData, function(i, v) {
            if (moment().isAfter(v.openTime) && moment().isBefore(v.scoresAvailableTime)) {
                currentWeek = v;
                return false;
            }
        });
        return currentWeek || weekData[0];
    };

    this.getWeekById = function(id) {
        var week = false;
        $.each(weekData, function(i, v) {
            if (v.id === id) {
                week = v;
                return false;
            }
        });
        return week;
    };
}