app.directive('scrollable', function() {
    return {
        restrict : 'A',
        transclude : true,
        replace : true,
        template :
            '<div class="scrollWrapper">' +
                '<div class="scroll">' +
                    '<ng-transclude></ng-transclude>' +
                '</div>' +
            '</div>'
    }
});