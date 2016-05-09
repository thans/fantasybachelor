import { AUTH_STATE_CHANGE, AUTH_STATE } from '../services/FacebookService';

export default function facebook(state = {
    authToken : null,
    authState : AUTH_STATE.UNKNOWN
}, action) {
    switch (action.type) {
        case AUTH_STATE_CHANGE:
            return Object.assign({}, state, {
                authToken: action.authToken || null,
                authState: action.authToken ? AUTH_STATE.AUTHENTICATED : AUTH_STATE.NOT_AUTHENTICATED
            });
        default:
            return state;
    }
}