var utils = {
    getSmallImage: function(contestant) {
        return CONSTANTS.SMALL_CONTESTANTS_DIR + contestant.codeName + 'Small.png';
    },

    getMediumImage: function(contestant) {
        return CONSTANTS.MEDIUM_CONTESTANTS_DIR + contestant.codeName + 'Medium.png';
    },

    getLargeImage: function(contestant) {
        return CONSTANTS.LARGE_CONTESTANTS_DIR + contestant.codeName + 'Large.png';
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