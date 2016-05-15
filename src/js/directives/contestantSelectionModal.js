import { MODAL_STATE, MODAL_STATE_CHANGE, MODAL, CONTESTANT_SELECTION_MODAL } from '../reducers/modals';
import _includes from 'lodash/includes';

export default function contestantSelectionModal($templateCache) {
    'ngInject';
    return {
        restrict : 'E',
        controller : ContestantSelectionModalController,
        controllerAs : 'contestantSelectionModal',
        bindToController: true,
        template : $templateCache.get('contestantSelectionModal.html'),
        scope : {}
    };
}

export const showContestantSelectionModal = (role, contestant, multiplier, isEliminated) => {
    return {
        type : MODAL_STATE_CHANGE,
        modal : MODAL.CONTESTANT_SELECTION,
        state : MODAL_STATE.VISIBLE,
        data : {
            role,
            contestant,
            multiplier,
            isEliminated
        }
    }
};

export const hideContestantSelectionModal = () => {
    return {
        type : MODAL_STATE_CHANGE,
        modal : MODAL.CONTESTANT_SELECTION,
        state : MODAL_STATE.HIDDEN
    }
};

export const changeContestantSelectionModalActiveSection = (section) => {
    return {
        type : MODAL_STATE_CHANGE,
        modal : MODAL.CONTESTANT_SELECTION,
        activeSection : section
    }
};

class ContestantSelectionModalController {

    constructor($ngRedux, $scope) {
        'ngInject';
        const unsubscribe = $ngRedux.connect(this.mapStateToThis, null)(this);
        $scope.$on('$destroy', unsubscribe);

        this.SECTIONS = CONTESTANT_SELECTION_MODAL.SECTIONS;

        this.dispatch = $ngRedux.dispatch;
    }

    close($event) {
        if ($event && !$event.target.attributes['root']) { return; }
        this.dispatch(hideContestantSelectionModal());
    }

    selectSection(section) {
        this.dispatch(changeContestantSelectionModalActiveSection(section));
    }

    static getActivatableSections(state) {
        const role = state.modals.contestantSelection.data.role;
        const contestant = state.modals.contestantSelection.data.contestant;
        const SECTIONS = CONTESTANT_SELECTION_MODAL.SECTIONS;
        
        if (role && contestant) {
            return [
                SECTIONS.SWITCH_ROLE,
                SECTIONS.SWITCH_CONTESTANT,
                SECTIONS.REMOVE_CONTESTANT,
                SECTIONS.VIEW_BIO,
                SECTIONS.ROLE_INFO
            ];
        }
        if (!role && contestant) {
            return [
                SECTIONS.SELECT_ROLE,
                SECTIONS.VIEW_BIO
            ];
        }
        if (role && !contestant) {
            return [
                SECTIONS.SELECT_CONTESTANT,
                SECTIONS.ROLE_INFO
            ];
        }
    }
    
    static getRenderedSection(state) {
        if (!state.modals.contestantSelection.visible) { return; }

        const SECTIONS = CONTESTANT_SELECTION_MODAL.SECTIONS;
        const activeSection = state.modals.contestantSelection.activeSection;
        // if (_includes(CONTESTANT_SELECTION_MODAL.ACTIVE_ONLY_SECTIONS, activeSection)) {
        //     if (isCurrentRoundPreSelectionOpen(state)) {
        //         return SECTIONS.PRE_SELECTION_OPEN;
        //     }
        //     if (isCurrentRoundSelectionClosed(state)) {
        //         return SECTIONS.SELECTION_CLOSED;
        //     }
        // }
        if (_includes([ SECTIONS.SELECT_CONTESTANT, SECTIONS.SWITCH_CONTESTANT ], activeSection)) {
            return SECTIONS.SELECT_CONTESTANT;
        }
        if (_includes([ SECTIONS.SELECT_ROLE, SECTIONS.SWITCH_ROLE ], activeSection)) {
            return SECTIONS.SELECT_ROLE;
        }
        return activeSection;
    }

    mapStateToThis(state) {
        return Object.assign({}, state.modals.contestantSelection, {
            activatableSections : ContestantSelectionModalController.getActivatableSections(state),
            renderedSection : ContestantSelectionModalController.getRenderedSection(state)
        });
    }
}
