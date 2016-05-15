import { getActiveRound, getCurrentRound, isCurrentRoundPreSelectionOpen, isCurrentRoundSelectionClosed } from '../../selectors/rounds';
import { isCurrentRoundSelectionFull } from '../../selectors/contestants';
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

    selectRole(role) {
        this.contestantSelectionService.selectContestant(this.contestant, role);
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
            role : state.modals.contestantSelection.data.role,
            contestant : state.modals.contestantSelection.data.contestant,
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