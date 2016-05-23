import { BACKEND_RESOURCE_STATE_CHANGE, BACKEND_RESOURCE_STATE, BACKEND_RESOURCE_TYPE } from '../services/BackendResourceService';
import update from 'react/lib/update';

export default function roles(state = {
    data : null,
    state : BACKEND_RESOURCE_STATE.UNKNOWN
}, action) {
    switch (action.type) {
        case BACKEND_RESOURCE_STATE_CHANGE:
            switch (action.resourceType) {
                case BACKEND_RESOURCE_TYPE.ROLES:
                    if (!action.data) {
                        return update(state, {
                            state : { $set : action.state }
                        });   
                    }
                    return update(state, {
                        data : { $set : action.data },
                        state : { $set : action.state }
                    });
                default:
                    return state;
            }
        default:
            return state;
    }
}