export default function contestantButton() {
    return {
        restrict : 'E',
        controller : ContestantButtonController,
        controllerAs : 'contestantButton',
        bindToController: true,
        templateUrl : VIEWS_DIR + '/contestantButton.html',
        scope : {
            role : '=',
            contestant : '=',
            isEliminated : '='
        }
    };
}

class ContestantButtonController {

    constructor($scope, $element) {
        'ngInject';

        if (!this.contestant) {
            return;
        }

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

    }
}
