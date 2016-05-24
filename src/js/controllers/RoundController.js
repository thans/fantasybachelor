import { setRoundModalVisibility } from '../directives/roundModal';
import { setLeagueModalVisibility } from '../directives/leagueModal';
import { showContestantSelectionModal } from '../directives/contestantSelectionModal';
import { getCurrentLeague, isCurrentUserCurrentLeagueAdmin, getCurrentLeagueUsers } from '../selectors/leagues';
import { getActiveRound, getCurrentUserCurrentRoundMultipliers, getCurrentLeagueUsersCurrentRoundMultipliers, getCurrentRound, getCurrentRoundScore, isCurrentRoundPreSelectionOpen, isCurrentRoundSelectionClosed } from '../selectors/rounds';
import { getCurrentRoundUnselectedEligibleContestants, getPrimaryContestant, getCurrentRoundSelectedContestants, getNumCurrentRoundSelectedContestants, isCurrentRoundSelectionFull, getContestantsById } from '../selectors/contestants';
import _includes from 'lodash/includes';
import _assign from 'lodash/assign';


export default class RoundController {

    constructor($ngRedux, $scope, $state, $interval, backendResourceService) {
        'ngInject';
        const unsubscribe = $ngRedux.connect((state) => this.mapStateToThis(state), {})(this);
        $scope.$on('$destroy', unsubscribe);

        const dataUpdateInterval = $interval(() => {
            if (this.currentLeague) {
                this.dispatch(this.backendResourceService.getUsers(this.currentLeague.memberIds));
            }
            this.dispatch(this.backendResourceService.getCurrentUser());
            this.dispatch(this.backendResourceService.getContestants());
            this.dispatch(this.backendResourceService.getRounds());
        }, 60 * 1000);
        $scope.$on('$destroy', () => $interval.cancel(dataUpdateInterval));



        const leagueUnsubscribe = $scope.$watch(() => this.currentLeague, (currentLeague) => {
            if (!currentLeague) {
                return;
            }

            this.dispatch(this.backendResourceService.getUsers(currentLeague.memberIds));

            leagueUnsubscribe();
        });
        
        this.dispatch = $ngRedux.dispatch;
        this.backendResourceService = backendResourceService;
        this.$state = $state;
        this.userCollapsed = false;
        this.userUncollapsed = false;
    }

    showRoundModal() {
        this.dispatch(setRoundModalVisibility(true));
    }

    showLeagueModal() {
        this.dispatch(setLeagueModalVisibility(true));
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
    
    getMultiplier(contestant, user) {
        if (!contestant || !this.currentUser || !this.activeRound) { return 1; }
        if (this.currentRound.index > this.activeRound.index) { return 1; }
        if (!user) { return this.currentUserMultipliers[contestant.id] }
        return this.multipliers[user.id][contestant.id];
    }

    getScore(contestant, role, user) {
        if (!contestant || !role) { return 0; }
        return (contestant.roundResults[this.currentRound.id][role.id].occurrences || 0) * role.pointsPerOccurrence
            + contestant.roses[this.currentRound.id] * this.getMultiplier(contestant, user);
    }

    goToActiveRound() {
        this.$state.transitionTo('round', _assign({}, this.router.params, {
            roundId : this.activeRound.id
        }));
    }

    mapStateToThis(state) {
        if (!getCurrentRound(state)) { return {} }
        return {
            currentRound : getCurrentRound(state),
            currentUser : state.currentUser.data,
            activeRound : getActiveRound(state),
            currentLeague : getCurrentLeague(state),
            currentLeagueUsers : getCurrentLeagueUsers(state),
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
            multipliers : getCurrentLeagueUsersCurrentRoundMultipliers(state),
            currentUserMultipliers : getCurrentUserCurrentRoundMultipliers(state),
            isContestantSelectionModalVisible : state.modals.contestantSelection.visible,
            isRoundModalVisible : state.modals.round,
            isLeagueModalVisible : state.modals.league,
            isCurrentUserCurrentLeagueAdmin : isCurrentUserCurrentLeagueAdmin(state),
            router : state.router,
            contestantsById : getContestantsById(state),
            isGlobalLeaderboard : getCurrentLeague(state) && getCurrentLeague(state).id === 'global'
        };
    }
}