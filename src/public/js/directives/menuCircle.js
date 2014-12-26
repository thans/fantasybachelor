app.directive('menuCircle', function() {
    return {
        restrict : 'A',
        replace : true,
        template : '<div class="menuCircle {{name}}" ng-class="{hover : hover}" ng-mouseover="hover = true" ng-mouseleave="hover = false">{{text}}</div>',
        scope : {
            hover : '='
        },
        link : function(scope, elem, attrs) {
            scope.text = attrs.text;
            scope.name = attrs.name;
        }
    }
});