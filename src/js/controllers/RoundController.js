import { setRoundModalVisibility } from '../directives/roundModal';
import { getCurrentRound, getCurrentRoundScore, isCurrentRoundPreSelectionOpen, isCurrentRoundSelectionClosed } from '../selectors/rounds';
import { getCurrentRoundEligibleContestants, getPrimaryContestant, getCurrentRoundSelectedContestants, getNumCurrentRoundSelectedContestants, isCurrentRoundSelectionFull } from '../selectors/contestants';
import _includes from 'lodash/includes';


export default class RoundController {

    constructor($ngRedux, $scope) {
        'ngInject';
        const unsubscribe = $ngRedux.connect((state) => this.mapStateToThis(state), {})(this);
        $scope.$on('$destroy', unsubscribe);
        
        this.dispatch = $ngRedux.dispatch;
        this.userCollapsed = false;
        this.userUncollapsed = false;
    }

    showRoundModal() {
        this.dispatch(setRoundModalVisibility(true));
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

    mapStateToThis(state) {
        return {
            currentRound : getCurrentRound(state),
            selectedContestants : getCurrentRoundSelectedContestants(state),
            numSelectedContestants : getNumCurrentRoundSelectedContestants(state),
            roles : state.roles.data,
            isSelectionFull : isCurrentRoundSelectionFull(state),
            isPreSelectionOpen : isCurrentRoundPreSelectionOpen(state),
            isSelectionClosed : isCurrentRoundSelectionClosed(state),
            primaryContestant : getPrimaryContestant(state),
            eligibleContestants : getCurrentRoundEligibleContestants(state),
            roundScore : getCurrentRoundScore(state),
            totalScore : state.currentUser.data.scores.score
        };
    }
}