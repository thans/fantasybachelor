import { ASYNC_LINK_STATE, ASYNC_LINK_STATE_CHANGE } from '../directives/asyncLink';
import _find from 'lodash/find';
import _assign from 'lodash/assign';

export default function asyncLink(state = {
    linkStates : {},
    allLoaded : false
}, action) {
    switch (action.type) {
        case ASYNC_LINK_STATE_CHANGE:
            let newState = _assign({}, state, {
                linkStates : _assign({}, state.linkStates, {
                    [action.url] : action.state
                })
            });
            newState.allLoaded = !_find(newState.linkStates, (value) => { return value === ASYNC_LINK_STATE.LOADING });
            return newState;
        default:
            return state;
    }
}