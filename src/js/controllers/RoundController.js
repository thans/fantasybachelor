import { setRoundModalVisibility } from '../directives/roundModal';
import { hideContestantSelectionModal, showContestantSelectionModal } from '../directives/contestantSelectionModal';
import { getActiveRound, getCurrentUserCurrentRoundMultipliers, getCurrentRound, getCurrentRoundScore, isCurrentRoundPreSelectionOpen, isCurrentRoundSelectionClosed } from '../selectors/rounds';
import { getCurrentRoundUnselectedEligibleContestants, getPrimaryContestant, getCurrentRoundSelectedContestants, getNumCurrentRoundSelectedContestants, isCurrentRoundSelectionFull } from '../selectors/contestants';
import _includes from 'lodash/includes';


export default class RoundController {

    constructor($ngRedux, $scope, $state) {
        'ngInject';
        const unsubscribe = $ngRedux.connect((state) => this.mapStateToThis(state), {})(this);
        $scope.$on('$destroy', unsubscribe);
        
        this.dispatch = $ngRedux.dispatch;
        this.$state = $state;
        this.userCollapsed = false;
        this.userUncollapsed = false;
    }

    showRoundModal() {
        this.dispatch(setRoundModalVisibility(true));
    }

    showContestantSelectionModal(contestant, role) {
        this.dispatch(showContestantSelectionModal(role, contestant, this.getMultiplier(contestant), this.isEliminated(contestant)));
    }

    toggleCollapsed() {
        if (!this.userCollapsed && !this.userUncollapsed) {
            this.userCollapsed = !this.isSelectionFull;
            this.userUncollapsed = this.isSelectionFull;
            return;
        }
        this.userCollapsed = !this.userCollapsed;
        this.userUncollapsed = !this.userUncollapsed;
    }

    isEliminated(contestant) {
        if (!contestant) { return false; }
        return _includes(this.currentRound.eliminatedContestantIds, contestant.id);
    }
    
    getMultiplier(contestant) {
        if (!contestant) { return 1; }
        return this.multipliers[contestant.id];
    }

    getScore(contestant, role) {
        if (!contestant || !role) { return 0; }
        return (contestant.roundResults[this.currentRound.id][role.id].occurrences || 0) * role.pointsPerOccurrence
            + contestant.roses[this.currentRound.id] * this.getMultiplier(contestant);
    }

    goToActiveRound() {
        this.$state.transitionTo('round', Object.assign({}, this.router.params, {
            roundId : this.activeRound.id
        }));
    }

    mapStateToThis(state) {
        return {
            currentRound : getCurrentRound(state),
            activeRound : getActiveRound(state),
            selectedContestants : getCurrentRoundSelectedContestants(state),
            numSelectedContestants : getNumCurrentRoundSelectedContestants(state),
            roles : state.roles.data,
            isSelectionFull : isCurrentRoundSelectionFull(state),
            isPreSelectionOpen : isCurrentRoundPreSelectionOpen(state),
            isSelectionClosed : isCurrentRoundSelectionClosed(state),
            primaryContestant : getPrimaryContestant(state),
            eligibleContestants : getCurrentRoundUnselectedEligibleContestants(state),
            roundScore : getCurrentRoundScore(state),
            totalScore : state.currentUser.data.scores.score,
            multipliers : getCurrentUserCurrentRoundMultipliers(state),
            isContestantSelectionModalVisible : state.modals.contestantSelection.visible,
            isRoundModalVisible : state.modals.round,
            router : state.router
        };
    }
}