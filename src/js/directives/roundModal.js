import { MODAL_STATE, MODAL_STATE_CHANGE, MODAL } from '../reducers/modals';
import { getActiveRound } from '../selectors/rounds';
import _assign from 'lodash/assign';

export default function roundModal($templateCache) {
    'ngInject';

    return {
        restrict : 'E',
        controller : RoundModalController,
        controllerAs : 'roundModal',
        bindToController: true,
        template : $templateCache.get('roundModal.html'),
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

    constructor($ngRedux, $scope, $state) {
        'ngInject';
        const unsubscribe = $ngRedux.connect(this.mapStateToThis, null)(this);
        $scope.$on('$destroy', unsubscribe);

        this.$state = $state;
        this.dispatch = $ngRedux.dispatch;
    }

    close() {
        this.dispatch(setRoundModalVisibility(false));
    }

    changeRound(round) {
        this.close();
        this.$state.transitionTo('round', _assign({}, this.router.params, {
            roundId : round.id
        }));
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
