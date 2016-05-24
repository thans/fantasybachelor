import { BACKEND_RESOURCE_STATE_CHANGE, BACKEND_RESOURCE_STATE, BACKEND_RESOURCE_TYPE } from '../services/BackendResourceService';
import _assign from 'lodash/assign';

export default function apiKey(state = {
    data : null,
    state : BACKEND_RESOURCE_STATE.UNKNOWN
}, action) {
    switch (action.type) {
        case BACKEND_RESOURCE_STATE_CHANGE:
            switch (action.resourceType) {
                case BACKEND_RESOURCE_TYPE.API_KEY:
                    return _assign({}, state, {
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