var ContestantLayout = function(arrangement, parentSelector, isScoringComplete) {
    var element = $('<div>').addClass('contestantLayout').appendTo(parentSelector);
    var scoringComplete = isScoringComplete;

    var contestantNum = 0;
    $.each(arrangement, function(i, v) {
        var row = $('<div>').addClass('row');
        for (var i = 0; i < v; i++) {
            contestantNum++;
            $('<div>')
                .addClass('contestant')
                .addClass('contestant' + contestantNum)
                .append('\
                    <div class="score"></div>\
                    <div class="image"></div>\
                ')
                .appendTo(row);
        }
        row.appendTo(element);
    });

    var numSelectedContestants = 0;

    var _clear = function() {
        element.find('.contestant')
            .off('click')
            .removeClass('enabled');
        element.find('.image')
            .backgroundImage('');
        element.find('.score')
            .attr('data-color', '');
        numSelectedContestants = 0;
    }
    this.clear = _clear;

    var _addContestant = function(contestant, multiplier, isEliminated, clickHandler) {
        if (numSelectedContestants < contestantNum) {
            numSelectedContestants++;
            var contestantElement = element.find('.contestant' + numSelectedContestants);
            contestantElement
                .click(clickHandler)
                .addClass('enabled');
            contestantElement.find('.image')
                .backgroundImage(utils.getMediumImage(contestant));
            if (scoringComplete) {
                if (isEliminated) {
                    contestantElement.find('.score')
                        .attr('data-color', 'red')
                        .text('-');
                } else {
                    contestantElement.find('.score')
                        .attr('data-color', 'green')
                        .text('+' + multiplier);
                }
            } else if (multiplier > 1) {
                contestantElement.find('.score')
                    .attr('data-color', 'yellow')
                    .html('&times;' + multiplier);
            }


        }
        return this;
    }
    this.addContestant = _addContestant;
}