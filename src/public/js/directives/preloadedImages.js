app.directive('preloadedImages', ['EVENTS', 'STATIC_IMAGES', 'contestantFactory', function(EVENTS, STATIC_IMAGES, contestantFactory) {
    return {
        controller : function($scope) {
            $scope.images = [];

            _.each(STATIC_IMAGES, function(image) {
                $scope.images.push({
                    src : image,
                    loaded : false,
                    type : 'static',
                })
            });

            var pushContestantImage = function(size, codename) {
                $scope.images.push({
                    src : 'images/contestants' + size + '/' + codename + size + '.png',
                    type : 'contestant',
                    loaded : false
                });
            };

            $scope.$on(EVENTS.CONTESTANTS.LOADED, function() {
                if (!contestantFactory.contestants) { return; }
                _.each(contestantFactory.contestants, function(contestant) {
                    pushContestantImage('Small', contestant.codename);
                    pushContestantImage('Medium', contestant.codename);
                    pushContestantImage('Large', contestant.codename);
                });
            });

            var watchForImageType = function(type, event) {
                var typeLoaded = false;
                $scope.$watch(function() {
                    return $scope.images;
                }, function() {
                    if (typeLoaded || !_.find($scope.images, { type : type }) || _.find($scope.images, { type : type, loaded : false })) { return; }
                    typeLoaded = true;
                    console.log('All ' + type + ' images loaded.');
                    $scope.$emit(event);
                }, true);
            };

            watchForImageType('contestant', EVENTS.IMAGES.CONTESTANTS_LOADED);
            watchForImageType('static', EVENTS.IMAGES.STATIC_LOADED);
        },
        template : '<img ng-repeat="image in images" preloaded-image ng-src="{{image.src}}" image="image" />'
    }
}]);