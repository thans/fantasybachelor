var BioModal = function(element) {
    element = $(element);

    this.setContestant = function(contestant, mode, clickHandler) {
        element.find('.close, .chooseMe, .removeMe').andSelf()
            .off('click')
            .click(function() {
                element.hide();
            }).children().click(function(e) {
                e.stopPropagation();
            });

        element.find('.title').text(contestant.name);

        var stats = element.find('.stats').empty();
        $.each(contestant.bioStatistics, function(i, v) {
            stats.append('<div class="stat"><span class="name">' + v.name + ':</span> ' + v.value + '</div>');
        });

        var questions = element.find('.questions').empty();
        $.each(contestant.bioQuestions, function(i, v) {
            questions.append('<div class="question"><span class="q">' + v.question + '</span><br>' + v.answer + '</div>');
        });

        element.find('.contestant').backgroundImage(utils.getLargeImage(contestant));

        element.find('.btn-large').hide();
        switch (mode) {
            case SELECTION_MODES.CHOOSABLE:
                element.find('.chooseMe').click(function() {
                    clickHandler(true);
                }).show();
                break;
            case SELECTION_MODES.REMOVABLE:
                element.find('.removeMe').click(function() {
                    clickHandler(false);
                }).show();
                break;
            case SELECTION_MODES.CONTESTANT_UNSELECTABLE:
                break;
            default:
                element.find('.disabled').text(mode).show();
                break;
        }
        return this;
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