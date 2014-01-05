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

    this.getCurrentWeekId = function(callback) {
        callback(2);
    };

    this.getWeekById = function(id, callback) {
        var week;
        $.each(weekData, function(i, v) {
            if (v.id === id) {
                week = v;
                return false;
            }
        });
        callback(week);
    };
}