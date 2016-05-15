import { getActiveRound, getCurrentRound, isCurrentRoundPreSelectionOpen, isCurrentRoundSelectionClosed } from '../../selectors/rounds';
import { isCurrentRoundSelectionFull } from '../../selectors/contestants';
import { hideContestantSelectionModal } from '../../directives/contestantSelectionModal';

export default function removeContestantSection($templateCache) {
    'ngInject';
    return {
        restrict : 'E',
        controller : RemoveContestantSectionController,
        controllerAs : 'removeContestantSection',
        bindToController: true,
        template : $templateCache.get('contestantSelectionSections/removeContestantSection.html'),
        scope : {}
    };
}

class RemoveContestantSectionController {

    constructor($ngRedux, $scope, $state, contestantSelectionService) {
        'ngInject';
        const unsubscribe = $ngRedux.connect(this.mapStateToThis, null)(this);
        $scope.$on('$destroy', unsubscribe);

        this.$state = $state;
        this.contestantSelectionService = contestantSelectionService;
    }

    close() {
        this.dispatch(hideContestantSelectionModal());
    }

    remove() {
        this.contestantSelectionService.removeContestant(this.contestant);
        this.close();
    }

    goToActiveRound() {
        this.close();
        this.$state.transitionTo('round', Object.assign({}, this.router.params, {
            roundId : this.activeRound.id
        }));
    }

    mapStateToThis(state) {
        return {
            contestant : state.modals.contestantSelection.data.contestant,
            currentRound : getCurrentRound(state),
            activeRound : getActiveRound(state),
            isSelectionFull : isCurrentRoundSelectionFull(state),
            isPreSelectionOpen : isCurrentRoundPreSelectionOpen(state),
            isSelectionClosed : isCurrentRoundSelectionClosed(state),
            router : state.router
        }
    }
}
