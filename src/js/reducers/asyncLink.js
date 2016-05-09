import { ASYNC_LINK_STATE, ASYNC_LINK_STATE_CHANGE } from '../directives/asyncLink';
import find from 'lodash/find';

export default function asyncLink(state = {
    linkStates : {},
    allLoaded : false
}, action) {
    switch (action.type) {
        case ASYNC_LINK_STATE_CHANGE:
            let newState = Object.assign({}, state, {
                linkStates : Object.assign({}, state.linkStates, {
                    [action.url] : action.state
                })
            });
            newState.allLoaded = !find(newState.linkStates, (value) => { return value === ASYNC_LINK_STATE.LOADING });
            return newState;
        default:
            return state;
    }
}