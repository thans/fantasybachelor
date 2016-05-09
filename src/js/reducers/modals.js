export const MODAL_STATE_CHANGE = 'MODAL_STATE_CHANGE';
export const MODAL_STATE = {
    VISIBLE : 'VISIBLE',
    HIDDEN : 'HIDDEN'
};
export const MODAL = {
    CURRENT_USER : 'CURRENT_USER',
    ROUND : 'ROUND'
};

export default function modals(state = {
    currentUser : false,
    round : false
}, action) {
    switch (action.type) {
        case MODAL_STATE_CHANGE:
            switch (action.modal) {
                case MODAL.CURRENT_USER:
                    return Object.assign({}, state, {
                        currentUser : action.state === MODAL_STATE.VISIBLE
                    });
                case MODAL.ROUND:
                    return Object.assign({}, state, {
                        round : action.state === MODAL_STATE.VISIBLE
                    });
                default:
                    return state;
            }
        default:
            return state;
    }
}