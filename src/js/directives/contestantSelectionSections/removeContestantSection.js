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

    constructor($ngRedux, $scope, contestantSelectionService) {
        'ngInject';
        const unsubscribe = $ngRedux.connect(this.mapStateToThis, null)(this);
        $scope.$on('$destroy', unsubscribe);

        this.contestantSelectionService = contestantSelectionService;
    }

    remove() {
        this.contestantSelectionService.removeContestant(this.contestant, this.role);
        this.dispatch(hideContestantSelectionModal());
    }

    mapStateToThis(state) {
        return {
            role : state.modals.contestantSelection.data.role,
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
