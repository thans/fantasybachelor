import { MODAL_STATE, MODAL_STATE_CHANGE, MODAL } from '../reducers/modals';
import { getActiveRound } from '../selectors/rounds'

export default function roundModal() {
    return {
        restrict : 'E',
        controller : RoundModalController,
        controllerAs : 'roundModal',
        bindToController: true,
        templateUrl : VIEWS_DIR + '/roundModal.html',
        scope : {}
    };
}

export const setRoundModalVisibility = (visible) => {
    return {
        type : MODAL_STATE_CHANGE,
        modal : MODAL.ROUND,
        state : visible ? MODAL_STATE.VISIBLE : MODAL_STATE.HIDDEN
    }
};

class RoundModalController {

    constructor($ngRedux, $scope, $location, $state, $stateParams) {
        'ngInject';
        const unsubscribe = $ngRedux.connect(this.mapStateToThis, null)(this);
        $scope.$on('$destroy', unsubscribe);

        this.$state = $state;
        this.$location = $location;
        this.$stateParams = $stateParams;
        this.dispatch = $ngRedux.dispatch;
        this.visible = false;
    }

    close() {
        this.dispatch(setRoundModalVisibility(false));
    }

    changeRound(round) {
        this.close();
        setTimeout(() => {
            this.$state.transitionTo('round', Object.assign({}, this.router.params, {
                roundId : round.id
            }));
        }, 100)
    }

    mapStateToThis(state) {
        return {
            rounds : state.rounds && state.rounds.data,
            activeRound : getActiveRound(state),
            visible : state.modals.round,
            router : state.router
        };
    }
}
