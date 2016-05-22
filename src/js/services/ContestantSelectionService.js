import { getCurrentRound } from '../selectors/rounds';
import { getCurrentRoundSelectedContestants } from '../selectors/contestants';
import { BACKEND_RESOURCE_STATE } from './BackendResourceService';
export default class ContestantSelectionService {

    constructor($ngRedux, backendResourceService) {
        'ngInject';
        this.$ngRedux = $ngRedux;
        this.backendResourceService = backendResourceService;
    }

    selectContestant(contestant, role) {
        return (dispatch) => {
            const state = this.$ngRedux.getState();
            const currentRound = getCurrentRound(state);
            const selectedContestants = getCurrentRoundSelectedContestants(state);
            const selectedContestant = selectedContestants[role.id];
            const currentRoles = _.invertBy(selectedContestants, 'id')[contestant.id];
            const currentRole = _.find(state.roles.data, { id : currentRoles ? currentRoles[0] : null });

            if (selectedContestant) {
                this.removeContestant(selectedContestant, role)((action) => {
                    dispatch(action);
                    if (action.state === BACKEND_RESOURCE_STATE.LOADED) {
                        if (currentRole) {
                            this.removeContestant(contestant, currentRole)((action) => {
                                dispatch(action);
                                if (action.state === BACKEND_RESOURCE_STATE.LOADED) {
                                    dispatch(this.backendResourceService.postPick(currentRound, contestant, role))
                                }
                            });
                            return;
                        }
                        dispatch(this.backendResourceService.postPick(currentRound, contestant, role))
                    }
                });
                return;
            }
            if (currentRole) {
                this.removeContestant(contestant, currentRole)((action) => {
                    dispatch(action);
                    if (action.state === BACKEND_RESOURCE_STATE.LOADED) {
                        dispatch(this.backendResourceService.postPick(currentRound, contestant, role))
                    }
                });
                return;
            }
            dispatch(this.backendResourceService.postPick(currentRound, contestant, role));
        }
    }

    removeContestant(contestant, role) {
        const state = this.$ngRedux.getState();
        const currentRound = getCurrentRound(state);
        return this.backendResourceService.deletePick(currentRound, contestant, role);
    }
}