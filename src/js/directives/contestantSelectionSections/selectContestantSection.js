import { getActiveRound, getCurrentUserCurrentRoundMultipliers, getCurrentRound, isCurrentRoundPreSelectionOpen, isCurrentRoundSelectionClosed } from '../../selectors/rounds';
import { getCurrentRoundEligibleContestants, isCurrentRoundSelectionFull } from '../../selectors/contestants';
import { hideContestantSelectionModal } from '../../directives/contestantSelectionModal';
import _includes from 'lodash/includes';
import _without from 'lodash/without';

export default function selectContestantSection($templateCache) {
    'ngInject';
    return {
        restrict : 'E',
        controller : SelectContestantSectionController,
        controllerAs : 'selectContestantSection',
        bindToController: true,
        template : $templateCache.get('contestantSelectionSections/selectContestantSection.html'),
        scope : {}
    };
}

class SelectContestantSectionController {

    constructor($ngRedux, $scope, contestantSelectionService) {
        'ngInject';
        const unsubscribe = $ngRedux.connect(this.mapStateToThis, null)(this);
        $scope.$on('$destroy', unsubscribe);
        
        this.contestantSelectionService = contestantSelectionService;
    }

    isEliminated(contestant) {
        if (!contestant) { return false; }
        return _includes(this.currentRound.eliminatedContestantIds, contestant.id);
    }

    getMultiplier(contestant) {
        if (!contestant) { return 1; }
        return this.multipliers[contestant.id];
    }

    selectContestant(contestant) {
        this.contestantSelectionService.selectContestant(contestant, this.role);
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
            eligibleContestants : _without(getCurrentRoundEligibleContestants(state), state.modals.contestantSelection.data.contestant),
            multipliers : getCurrentUserCurrentRoundMultipliers(state),
            router : state.router
        }
    }
}
