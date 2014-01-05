var Dropdown = function() {
    var element = $('<div class="dropdown"><span class="label">Test</span><span class="arrow"></span></div>');
    var popover = $('<div class="dropdownPopover"><ul class="items"></ul></div>');

    element.hover(function() {
        popover.css({
            top: element.position().top,
            left: element.position().left
        }).appendTo($('body')).show();
    });
    popover.hover(function() {}, function() {
        this.hide().remove();
    });

    this.appendTo = function(parent) {
        element.appendTo($(parent));
        return this;
    }

    this.addItem = function(item) {
        item.addClass('item');
        popover.find('.items').append(item);
        return this;
    }

    this.addDivider = function() {
        popover.find('.item').last().addClass('divider');
        return this;
    }
}