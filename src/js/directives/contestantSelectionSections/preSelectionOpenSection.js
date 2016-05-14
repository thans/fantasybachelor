import { getActiveRound, getCurrentRound } from '../../selectors/rounds';
import { hideContestantSelectionModal } from '../../directives/contestantSelectionModal';

export default function preSelectionOpenSection() {
    return {
        restrict : 'E',
        controller : PreSelectionOpenSectionController,
        controllerAs : 'preSelectionOpenSection',
        bindToController: true,
        templateUrl : VIEWS_DIR + '/contestantSelectionSections/preSelectionOpenSection.html',
        scope : {}
    };
}

class PreSelectionOpenSectionController {

    constructor($ngRedux, $scope, $state) {
        'ngInject';
        const unsubscribe = $ngRedux.connect(this.mapStateToThis, null)(this);
        $scope.$on('$destroy', unsubscribe);

        this.$state = $state;
    }

    close() {
        this.dispatch(hideContestantSelectionModal());
    }

    goToActiveRound() {
        this.close();
        this.$state.transitionTo('round', Object.assign({}, this.router.params, {
            roundId : this.activeRound.id
        }));
    }

    mapStateToThis(state) {
        return {
            currentRound : getCurrentRound(state),
            activeRound : getActiveRound(state),
            router : state.router
        }
    }
}
