import { MODAL_STATE, MODAL_STATE_CHANGE, MODAL } from '../reducers/modals';
import { getCurrentLeague } from '../selectors/leagues'
import _assign from 'lodash/assign';

export default function leagueModal($templateCache) {
    'ngInject';

    return {
        restrict : 'E',
        controller : LeagueModalController,
        controllerAs : 'leagueModal',
        bindToController: true,
        template : $templateCache.get('leagueModal.html'),
        scope : {}
    };
}

export const setLeagueModalVisibility = (visible) => {
    return {
        type : MODAL_STATE_CHANGE,
        modal : MODAL.LEAGUE,
        state : visible ? MODAL_STATE.VISIBLE : MODAL_STATE.HIDDEN
    }
};

class LeagueModalController {

    constructor($ngRedux, $scope, $state, backendResourceService) {
        'ngInject';
        const unsubscribe = $ngRedux.connect(this.mapStateToThis, null)(this);
        $scope.$on('$destroy', unsubscribe);

        this.$state = $state;
        this.dispatch = $ngRedux.dispatch;
        this.backendResourceService = backendResourceService;

        this.creatingLeague = false;
        this.newLeague = '';
    }

    close() {
        this.dispatch(setLeagueModalVisibility(false));
    }

    createLeague() {
        this.creatingLeague = true;
    }

    changeLeague(league) {
        this.close();
        this.$state.transitionTo('round', _assign({}, this.router.params, {
            leagueId : league.id
        }));
    }

    saveLeague() {
        this.creatingLeague = false;
        if (!this.newLeague) { return; }
        this.dispatch(this.backendResourceService.postLeague(this.newLeague));
        this.close();
    }

    mapStateToThis(state) {
        return {
            leagues : state.currentUser.data.leagues,
            currentLeague : getCurrentLeague(state),
            visible : state.modals.league,
            router : state.router
        };
    }
}
