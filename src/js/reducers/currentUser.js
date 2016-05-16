import update from 'react/lib/update';

import { BACKEND_RESOURCE_STATE_CHANGE, BACKEND_RESOURCE_STATE, BACKEND_RESOURCE_TYPE } from '../services/BackendResourceService';

export default function currentUser(state = {
    data : null,
    state : BACKEND_RESOURCE_STATE.UNKNOWN
}, action) {
    switch (action.type) {
        case BACKEND_RESOURCE_STATE_CHANGE:
            switch (action.resourceType) {
                case BACKEND_RESOURCE_TYPE.CURRENT_USER:
                    if (action.state !== BACKEND_RESOURCE_STATE.LOADED) {
                        return update(state, {
                            state: { $set : action.state }
                        });
                    }
                    return update(state, {
                        data: { $set : action.data },
                        state: { $set : action.state }
                    });
                case BACKEND_RESOURCE_TYPE.NICKNAME:
                    if (!action.data || !state.data) { return state; }
                    return update(state, {
                        data : {
                            nickname : { $set : action.data }
                        }
                    });
                default:
                    return state;
            }
        default:
            return state;
    }
}