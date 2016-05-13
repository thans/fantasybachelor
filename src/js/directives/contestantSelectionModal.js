import { MODAL_STATE, MODAL_STATE_CHANGE, MODAL } from '../reducers/modals';

export default function contestantSelectionModal() {
    return {
        restrict : 'E',
        controller : ContestantSelectionModalController,
        controllerAs : 'contestantSelectionModal',
        bindToController: true,
        templateUrl : VIEWS_DIR + '/contestantSelectionModal.html',
        scope : {}
    };
}

export const setContestantSelectionModalVisibility = (visible) => {
    return {
        type : MODAL_STATE_CHANGE,
        modal : MODAL.CONTESTANT_SELECTION,
        state : visible ? MODAL_STATE.VISIBLE : MODAL_STATE.HIDDEN
    }
};

export const setContestantSelectionModalParameters = (role, contestant, multiplier, isEliminated) => {
    return {
        type : MODAL_STATE_CHANGE,
        modal : MODAL.CONTESTANT_SELECTION,
        data : {
            role,
            contestant,
            multiplier,
            isEliminated
        }
    }
};

class ContestantSelectionModalController {

    constructor($ngRedux, $scope) {
        'ngInject';
        const unsubscribe = $ngRedux.connect(this.mapStateToThis, null)(this);
        $scope.$on('$destroy', unsubscribe);

        this.dispatch = $ngRedux.dispatch;
        this.visible = false;
    }

    close($event) {
        if ($event && !$event.target.attributes['root']) { return; }
        this.dispatch(setContestantSelectionModalVisibility(false));
    }

    mapStateToThis(state) {
        return state.modals.contestantSelection;
    }
}
