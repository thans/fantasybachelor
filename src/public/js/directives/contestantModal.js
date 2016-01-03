app.directive('contestantModal', ['$rootScope', 'EVENTS', 'CONTESTANT_MODAL_MODES', function($rootScope, EVENTS, CONTESTANT_MODAL_MODES) {
    return {
        restrict : 'A',
        templateUrl : 'view/contestantModal',
        scope : {},
        controller : ['$scope', '$element', function($scope, $element) {
            $scope.visible = false;
            $scope.contestant = {};

            $scope.woman = 'https://resources.fantasybach.com/season:NJWJTpZ8x/bodyShots/Woman.jpg';

            $scope.close = function() {
                $scope.visible = false;
            };

            $scope.buttonClicked = function() {
                if (!$scope.enabled) { return; }
                $scope.close();
                $scope.callback && $scope.callback();
            };

            $scope.roleClicked = function(role) {
                if (!role.enabled) { return; }
                $scope.close();
                $scope.callback && $scope.callback(role);
            };

            $rootScope.$on(EVENTS.CONTESTANT_MODAL.SHOW, function(event, options) {
                if (!options.mode || !options.contestant) { return; }
                $scope.contestant = options.contestant;
                $scope.callback = options.callback;

                var mode = _.find(CONTESTANT_MODAL_MODES, options.mode);
                $scope.text = mode.text;
                $scope.enabled = mode.enabled;
                $scope.singleButton = mode.singleButton;
                $scope.roles = options.roles;

                $scope.visible = true;
                $element.find('.innerWrapper').scrollTop(0);
            })
        }]
    };
}]);
