var Dropdown = function() {
    var element = $('<div class="dropdown"><span class="label"></span><span class="arrow"></span></div>');
    var popover = $('<div class="dropdownPopover"><ul class="items"></ul></div>').appendTo($('body')).hide();;

    element.hover(function() {
        console.log('element ON');
        popover.css({
            top: element.position().top,
            left: element.position().left
        }).show();
    }, function() {
        console.log('element OFF');
    });
    popover.hover(function() {
        console.log('Popover ON');
    }, function() {
        console.log('Popover OFF');
        $(this).hide();
    });

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