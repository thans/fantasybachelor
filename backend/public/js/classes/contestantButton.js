var ContestantButton = function() {
    var selectionFull = false;
    var selectableContestant = true;
    var selectionClosed = false;
    var selected = false;
    var contestant;
    var multiplier;
    var element = $('<div>');

    var _click = function(handler) {
        if (handler) {
            element.off('click').click($.proxy(handler, this));
        }
        return this;
    }
    this.click = _click;

    var _selectionFull = function(isSelectionFull) {
        if (isSelectionFull !== undefined) {
            selectionFull = isSelectionFull;
            return this;
        } else {
            return selectionFull;
        }
    }
    this.selectionFull = _selectionFull;

    var _selectableContestant = function(isSelectableContestant) {
        if (isSelectableContestant !== undefined) {
            selectableContestant = isSelectableContestant;
            return this;
        } else {
            return selectableContestant;
        }
    }
    this.selectableContestant = _selectableContestant;

    var _selectionClosed = function(isSelectionClosed) {
        if (isSelectionClosed !== undefined) {
            selectionClosed = isSelectionClosed;
            return this;
        } else {
            return selectionClosed;
        }
    }
    this.selectionClosed = _selectionClosed;

    var _mode = function() {
        if (!selectableContestant) {
            return SELECTION_MODES.CONTESTANT_UNSELECTABLE;
        } else if (selectionClosed) {
            return SELECTION_MODES.SELECTION_CLOSED;
        } else if (selected) {
            return SELECTION_MODES.REMOVABLE;
        } else if (selectionFull) {
            return SELECTION_MODES.SELECTION_FULL;
        }
        return SELECTION_MODES.CHOOSABLE;
    }
    this.mode = _mode;

    var _selected = function(isSelected) {
        if (isSelected !== undefined) {
            selected = isSelected;
            element.toggleClass('selected', selected);
            return this;
        } else {
            return selected;
        }
    }
    this.selected = _selected;

    var _contestant = function(newContestant) {
        if (newContestant !== undefined) {
            contestant = newContestant;
            element
                .attr('data-id', contestant.id)
                .css('background-image', 'url("' + utils.getSmallImage(contestant) + '")')
                .text(contestant.name);
            return this;
        } else {
            return contestant;
        }
    }
    this.contestant = _contestant;

    var multiplier = function(newMultiplier) {
        if (newMultiplier !== undefined) {
            multiplier = newMultiplier;
            if (multiplier > 1) {
                element.append('<div class="score" data-color="yellow">&times;' + multiplier + '</div>');
            } else {
                element.empty().text(contestant.name);
            }
            return this;
        } else {
            return multiplier;
        }
    }
    this.multiplier = multiplier;

    var _appendTo = function(parent) {
        if (parent !== undefined) {
            element.appendTo('<li>').parent().appendTo(parent);
        }
        return this;
    }
    this.appendTo = _appendTo;

}