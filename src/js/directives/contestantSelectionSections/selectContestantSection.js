import { getActiveRound, getCurrentUserCurrentRoundMultipliers, getCurrentRound, isCurrentRoundPreSelectionOpen, isCurrentRoundSelectionClosed } from '../../selectors/rounds';
import { getCurrentRoundEligibleContestants, isCurrentRoundSelectionFull } from '../../selectors/contestants';
import { hideContestantSelectionModal } from '../../directives/contestantSelectionModal';
import _includes from 'lodash/includes';
import _without from 'lodash/without';

export default function selectContestantSection() {
    return {
        restrict : 'E',
        controller : SelectContestantSectionController,
        controllerAs : 'selectContestantSection',
        bindToController: true,
        templateUrl : VIEWS_DIR + '/contestantSelectionSections/selectContestantSection.html',
        scope : {}
    };
}

class SelectContestantSectionController {

    constructor($ngRedux, $scope, $state, contestantSelectionService) {
        'ngInject';
        const unsubscribe = $ngRedux.connect(this.mapStateToThis, null)(this);
        $scope.$on('$destroy', unsubscribe);
        
        this.$state = $state;
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

    close() {
        this.dispatch(hideContestantSelectionModal());
    }

    selectContestant(contestant) {
        this.contestantSelectionService.selectContestant(contestant, this.role);
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
            eligibleContestants : _without(getCurrentRoundEligibleContestants(state), state.modals.contestantSelection.data.contestant),
            multipliers : getCurrentUserCurrentRoundMultipliers(state),
            router : state.router
        }
    }
}
