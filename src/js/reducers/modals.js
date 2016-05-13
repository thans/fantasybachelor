import update from 'react/lib/update';

export const MODAL_STATE_CHANGE = 'MODAL_STATE_CHANGE';
export const MODAL_STATE = {
    VISIBLE : 'VISIBLE',
    HIDDEN : 'HIDDEN'
};
export const MODAL = {
    CURRENT_USER : 'CURRENT_USER',
    ROUND : 'ROUND',
    CONTESTANT_SELECTION : 'CONTESTANT_SELECTION'
};

export default function modals(state = {
    currentUser : false,
    round : false,
    contestantSelection : {
        visible : false,
        data : {}
    }
}, action) {
    switch (action.type) {
        case MODAL_STATE_CHANGE:
            switch (action.modal) {
                case MODAL.CURRENT_USER:
                    return update(state, {
                        currentUser : { $set : action.state === MODAL_STATE.VISIBLE }
                    });
                case MODAL.ROUND:
                    return update(state, {
                        round : { $set : action.state === MODAL_STATE.VISIBLE }
                    });
                case MODAL.CONTESTANT_SELECTION:
                    if (action.data) {
                        return update(state, {
                            contestantSelection : {
                                data : { $set : action.data }
                            }
                        });
                    }
                    return update(state, {
                        contestantSelection : {
                            visible : { $set : action.state === MODAL_STATE.VISIBLE }
                        }
                    });
                default:
                    return state;
            }
        default:
            return state;
    }
}