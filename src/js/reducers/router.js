import { ROUTE_CHANGE } from '../run/router';
import _mapValues from 'lodash/mapValues';
import _assign from 'lodash/assign';

export default function router(state = {
    state : '',
    params : {}
}, action) {
    switch (action.type) {
        case ROUTE_CHANGE:
            return _assign({}, state, {
                state : action.state,
                params : _mapValues(action.params, (param) => { return decodeURIComponent(param) })
            });
        default:
            return state;
    }
}