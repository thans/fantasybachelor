var PopUp = function(element) {
    element = $(element);

    this.initialize = function(contestant, mode, clickHandler) {
        element.find('.close, .chooseMe').andSelf()
            .click(function() {
                element.hide();
            }).children().click(function(e) {
                e.stopPropagation();
            });
    }

    this.show = function() {
        element.show();
        return this;
    }
    this.hide = function() {
        element.hide();
        return this;
    }
}