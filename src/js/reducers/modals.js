import update from 'react/lib/update';

export const MODAL_STATE_CHANGE = 'MODAL_STATE_CHANGE';
export const MODAL_STATE = {
    VISIBLE : 'VISIBLE',
    HIDDEN : 'HIDDEN'
};
export const MODAL = {
    CURRENT_USER : 'CURRENT_USER',
    ROUND : 'ROUND',
    LEAGUE : 'LEAGUE',
    CONTESTANT_SELECTION : 'CONTESTANT_SELECTION'
};


export const CONTESTANT_SELECTION_MODAL = {
    SECTIONS : {
        PRE_SELECTION_OPEN : 'pre selection open',
        SELECTION_CLOSED : 'selection closed',
        SELECT_CONTESTANT : 'select contestant',
        SELECT_ROLE : 'select role',
        SWITCH_CONTESTANT : 'switch contestant',
        SWITCH_ROLE : 'switch role',
        REMOVE_CONTESTANT : 'remove',
        VIEW_BIO : 'view bio',
        ROLE_INFO : 'role info'
    }
};
CONTESTANT_SELECTION_MODAL.ACTIVE_ONLY_SECTIONS = [
    CONTESTANT_SELECTION_MODAL.SECTIONS.SELECT_CONTESTANT,
    CONTESTANT_SELECTION_MODAL.SECTIONS.SELECT_ROLE,
    CONTESTANT_SELECTION_MODAL.SECTIONS.SWITCH_CONTESTANT,
    CONTESTANT_SELECTION_MODAL.SECTIONS.SWITCH_ROLE,
    CONTESTANT_SELECTION_MODAL.SECTIONS.REMOVE_CONTESTANT
];

export default function modals(state = {
    currentUser : false,
    round : false,
    league : false,
    contestantSelection : {
        visible : false,
        data : {},
        activeSection : null
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
                case MODAL.LEAGUE:
                    return update(state, {
                        league : { $set : action.state === MODAL_STATE.VISIBLE }
                    });
                case MODAL.CONTESTANT_SELECTION:
                    if (action.activeSection) {
                        return update(state, {
                            contestantSelection : {
                                activeSection : { $set : action.activeSection }
                            }
                        });
                    }

                    if (action.state === MODAL_STATE.VISIBLE) {

                        let activeSection = null;
                        if (action.data.role && action.data.contestant) {
                            activeSection = CONTESTANT_SELECTION_MODAL.SECTIONS.SWITCH_ROLE
                        }
                        if (!action.data.role && action.data.contestant) {
                            activeSection = CONTESTANT_SELECTION_MODAL.SECTIONS.SELECT_ROLE
                        }
                        if (action.data.role && !action.data.contestant) {
                            activeSection = CONTESTANT_SELECTION_MODAL.SECTIONS.SELECT_CONTESTANT
                        }

                        return update(state, {
                            contestantSelection : {
                                visible : { $set : true },
                                data : { $set : action.data },
                                activeSection : { $set : activeSection }
                            }
                        });
                    }

                    return update(state, {
                        contestantSelection : {
                            visible : { $set : false }
                        }
                    });
                default:
                    return state;
            }
        default:
            return state;
    }
}