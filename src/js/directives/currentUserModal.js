import { MODAL_STATE, MODAL_STATE_CHANGE, MODAL } from '../reducers/modals';

export default function currentUserModal() {
    return {
        restrict : 'E',
        controller : CurrentUserModalController,
        controllerAs : 'currentUserModal',
        bindToController: true,
        templateUrl : VIEWS_DIR + '/currentUserModal.html',
        scope : {}
    };
}

export const setCurrentUserModalVisibility = (visible) => {
    return {
        type : MODAL_STATE_CHANGE,
        modal : MODAL.CURRENT_USER,
        state : visible ? MODAL_STATE.VISIBLE : MODAL_STATE.HIDDEN
    }
};

class CurrentUserModalController {

    constructor($ngRedux, $scope, backendResourceService) {
        'ngInject';
        const unsubscribe = $ngRedux.connect(this.mapStateToThis, null)(this);
        $scope.$on('$destroy', unsubscribe);

        this.dispatch = $ngRedux.dispatch;
        this.backendResourceService = backendResourceService;

        this.changingNickname = false;
        this.newNickname = '';
    }
    
    close() {
        this.dispatch(setCurrentUserModalVisibility(false));
    }
    
    changeNickname() {
        this.changingNickname = true;
    }
    
    saveNickname() {
        this.changingNickname = false;
        if (!this.newNickname || this.newNickname === this.user.nickname) { return; }
        this.dispatch(this.backendResourceService.postNickname(this.newNickname));
    }

    mapStateToThis(state) {
        return {
            user : state.currentUser && state.currentUser.data,
            visible : state.modals.currentUser
        };
    }
}
