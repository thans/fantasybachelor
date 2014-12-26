app.directive('preloadedImage', function() {
    return {
        scope : {
            image : '='
        },
        link : function(scope, element, attrs) {
            element.bind('load', function() {
                scope.image.loaded = true;
                scope.$apply();
            })
        }
    }
});