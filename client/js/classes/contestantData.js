var ContestantData = function() {
    var contestants;

    this.load = function(user, callback) {
        return $.get(URLS.GET_CONTESTANTS, {userId: user.id}).done(function(results) {
            contestants = results;
            callback && callback();
        });
    }

    this.getContestantById = function(contestantId) {
        var contestant = false;
        $.each(contestants, function(i, v) {
            if (v.id === contestantId) {
                contestant = v;
            }
        });
        return contestant;
    };
}