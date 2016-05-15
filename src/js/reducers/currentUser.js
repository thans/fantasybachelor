import { BACKEND_RESOURCE_STATE_CHANGE, BACKEND_RESOURCE_STATE, BACKEND_RESOURCE_TYPE } from '../services/BackendResourceService';

export default function currentUser(state = {
    data : null,
    state : BACKEND_RESOURCE_STATE.UNKNOWN
}, action) {
    switch (action.type) {
        case BACKEND_RESOURCE_STATE_CHANGE:
            switch (action.resourceType) {
                case BACKEND_RESOURCE_TYPE.CURRENT_USER:
                    if (action.data) { action.data.leagueIds = [ '1234' ] };
                    return Object.assign({}, state, {
                        data: action.data || null,
                        state: action.state
                    });
                case BACKEND_RESOURCE_TYPE.NICKNAME:
                    if (!action.data || !state.data) { return state; }
                    return Object.assign({}, state, {
                        data: Object.assign({}, state.data, {
                            nickname: action.data
                        })
                    });
                default:
                    return state;
            }
        default:
            return state;
    }
}