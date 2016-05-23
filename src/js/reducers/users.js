import { BACKEND_RESOURCE_STATE_CHANGE, BACKEND_RESOURCE_STATE, BACKEND_RESOURCE_TYPE } from '../services/BackendResourceService';
import update from 'react/lib/update';
import _keyBy from 'lodash/keyBy';

export default function roles(state = {
    data : {},
    state : BACKEND_RESOURCE_STATE.UNKNOWN
}, action) {
    switch (action.type) {
        case BACKEND_RESOURCE_STATE_CHANGE:
            switch (action.resourceType) {
                case BACKEND_RESOURCE_TYPE.USERS:
                    if (!action.data) {
                        return update(state, {
                            state: { $set : action.state }
                        });
                    }
                    return update(state, {
                        state: { $set : action.state },
                        data: { $merge : _keyBy(action.data, 'id') }
                    });
                default:
                    return state;
            }
        default:
            return state;
    }
}