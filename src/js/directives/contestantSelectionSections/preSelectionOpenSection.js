import { getActiveRound, getCurrentRound } from '../../selectors/rounds';
import { hideContestantSelectionModal } from '../../directives/contestantSelectionModal';
import _assign from 'lodash/assign';

export default function preSelectionOpenSection($templateCache) {
    'ngInject';
    return {
        restrict : 'E',
        controller : PreSelectionOpenSectionController,
        controllerAs : 'preSelectionOpenSection',
        bindToController: true,
        template : $templateCache.get('contestantSelectionSections/preSelectionOpenSection.html'),
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
        this.$state.transitionTo('round', _assign({}, this.router.params, {
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
