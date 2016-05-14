import { getActiveRound, getCurrentRound } from '../../selectors/rounds';
import { hideContestantSelectionModal } from '../../directives/contestantSelectionModal';

export default function selectionClosedSection() {
    return {
        restrict : 'E',
        controller : SelectionClosedSectionController,
        controllerAs : 'selectionClosedSection',
        bindToController: true,
        templateUrl : VIEWS_DIR + '/contestantSelectionSections/selectionClosedSection.html',
        scope : {}
    };
}

class SelectionClosedSectionController {

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
