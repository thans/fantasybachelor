app.directive('menuCircle', function() {
    return {
        template : '<div class="menuCircleWrapper {{name}}" ng-class="{hover : hover}" ng-mouseover="hover = true" ng-mouseleave="hover = false"><div class="menuCircle">{{text}}</div></div>',
        scope : {
            hover : '='
        },
        link : function(scope, elem, attrs) {
            scope.text = attrs.text;
            scope.name = attrs.name;
        }
    }
});