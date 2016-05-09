import { BACKEND_RESOURCE_STATE_CHANGE, BACKEND_RESOURCE_STATE, BACKEND_RESOURCE_TYPE } from '../services/BackendResourceService';

export default function rounds(state = {
    data : null,
    state : BACKEND_RESOURCE_STATE.UNKNOWN
}, action) {
    switch (action.type) {
        case BACKEND_RESOURCE_STATE_CHANGE:
            switch (action.resourceType) {
                case BACKEND_RESOURCE_TYPE.ROUNDS:
                    return Object.assign({}, state, {
                        data: action.data || null,
                        state: action.state
                    });
                default:
                    return state;
            }
        default:
            return state;
    }
}