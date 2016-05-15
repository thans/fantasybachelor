export default function contestantButton($templateCache) {
    'ngInject';
    
    return {
        restrict : 'E',
        controller : ContestantButtonController,
        controllerAs : 'contestantButton',
        bindToController: true,
        template : $templateCache.get('contestantButton.html'),
        scope : {
            role : '=',
            contestant : '=',
            isEliminated : '=',
            multiplier : '=',
            score : '=',
            showScore : '='
        }
    };
}

class ContestantButtonController {

    constructor($scope, $element) {
        'ngInject';

        const unsubscribe = $scope.$watch(() => this.contestant, (contestant) => {
            if (!contestant) {
                return;
            }

            unsubscribe();

            const img = new Image();
            img.src = this.contestant.images.head;
            this.loading = !img.complete;

            if (!this.loading) {
                return;
            }
            $element.find('img')[0].onload = () => {
                this.loading = false;
                $scope.$apply();
            };
        });
    }
}
