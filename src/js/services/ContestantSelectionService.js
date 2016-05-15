import { getCurrentRound } from '../selectors/rounds';
import { getCurrentRoundSelectedContestants } from '../selectors/contestants';
export default class ContestantSelectionService {

    constructor($ngRedux, backendResourceService) {
        'ngInject';
        this.$ngRedux = $ngRedux;
        this.backendResourceService = backendResourceService;
    }

    selectContestant(contestant, role) {
        const state = this.$ngRedux.getState();
        const currentRound = getCurrentRound(state);
        const selectedContestant = getCurrentRoundSelectedContestants(state)[role.id];

        if (selectedContestant) {
            return this.removeContestant(selectedContestant, role).then(() => {
                return this.backendResourceService.postPick(currentRound, contestant, role);
            });
        }
        return this.backendResourceService.postPick(currentRound, contestant, role);
    }

    removeContestant(contestant, role) {
        const state = this.$ngRedux.getState();
        const currentRound = getCurrentRound(state);
        return this.backendResourceService.deletePick(currentRound, contestant, role);
    }
}