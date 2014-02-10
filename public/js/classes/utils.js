var utils = {
    getSmallImage: function(contestant) {
        return CONSTANTS.SMALL_CONTESTANTS_DIR + contestant.codename + 'Small.png';
    },

    getMediumImage: function(contestant) {
        return CONSTANTS.MEDIUM_CONTESTANTS_DIR + contestant.codename + 'Medium.png';
    },

    getLargeImage: function(contestant) {
        return CONSTANTS.LARGE_CONTESTANTS_DIR + contestant.codename + 'Large.png';
    }
}

$.fn.backgroundImage = function(backgroundImage) {
    return this.each(function() {
        if (backgroundImage) {
            $(this).css('background-image', 'url("' + backgroundImage + '")');
        } else {
            $(this).css('background-image', '');
        }
    });
};