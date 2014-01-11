var Dropdown = function() {
    var element = $('<div class="dropdown"><span class="label"></span><span class="arrow"></span></div>');
    var popover = $('<div class="dropdownPopover"><ul class="items"></ul></div>')
        .appendTo($('body'))
        .hide()
        .click(function() {
            $(this).hide();
        });

    element.hover(function() {
        popover.css({
            top: element.position().top,
            left: element.position().left
        }).show();
    });
    popover.hover(function() {}, function() {
        $(this).hide();
    });

    this.clear = function() {
        $(popover).find('.items').empty();
        return this;
    }

    this.appendTo = function(parent) {
        element.appendTo($(parent));
        return this;
    }

    this.addItem = function(item) {
        item
            .addClass('item')
            .appendTo(popover.find('.items'));
        return this;
    }

    this.setSelected = function(id) {
        popover.find('.selected').removeClass('selected');
        element.find('.label').text(popover.find('.items > [data-id="' + id + '"]').first().addClass('selected').text());
    }

    this.addDivider = function() {
        popover.find('.item').last().addClass('divider');
        return this;
    }
}