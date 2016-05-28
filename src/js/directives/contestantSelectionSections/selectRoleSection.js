import { getActiveRound, getCurrentRound, isCurrentRoundPreSelectionOpen, isCurrentRoundSelectionClosed } from '../../selectors/rounds';
import { isCurrentRoundSelectionFull, getCurrentRoundSelectedContestants } from '../../selectors/contestants';
import { hideContestantSelectionModal } from '../../directives/contestantSelectionModal';
import _without from 'lodash/without';

export default function selectRoleSection($templateCache) {
    'ngInject';
    return {
        restrict : 'E',
        controller : SelectRoleSectionController,
        controllerAs : 'selectRoleSection',
        bindToController: true,
        template : $templateCache.get('contestantSelectionSections/selectRoleSection.html'),
        scope : {}
    };
}

class SelectRoleSectionController {

    constructor($ngRedux, $scope, contestantSelectionService) {
        'ngInject';
        const unsubscribe = $ngRedux.connect(this.mapStateToThis, null)(this);
        $scope.$on('$destroy', unsubscribe);

        this.contestantSelectionService = contestantSelectionService;
    }

    selectRole(role) {
        this.dispatch(this.contestantSelectionService.selectContestant(this.contestant, role));
        this.dispatch(hideContestantSelectionModal());
    }

    mapStateToThis(state) {
        return {
            role : state.modals.contestantSelection.data.role,
            contestant : state.modals.contestantSelection.data.contestant,
            selectedContestants : getCurrentRoundSelectedContestants(state),
            currentRound : getCurrentRound(state),
            activeRound : getActiveRound(state),
            isSelectionFull : isCurrentRoundSelectionFull(state),
            isPreSelectionOpen : isCurrentRoundPreSelectionOpen(state),
            isSelectionClosed : isCurrentRoundSelectionClosed(state),
            roles : _without(state.roles.data, state.modals.contestantSelection.data.role),
            router : state.router
        }
    }
}
