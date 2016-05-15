import { setCurrentUserModalVisibility } from '../directives/currentUserModal'

export default function heading($templateCache) {
    'ngInject';
    return {
        restrict : 'E',
        controller : HeadingController,
        controllerAs : 'heading',
        bindToController : true,
        template : $templateCache.get('heading.html'),
        scope : {}
    };
}

class HeadingController {

    constructor($ngRedux, $scope) {
        'ngInject';
        const unsubscribe = $ngRedux.connect(this.mapStateToThis, null)(this);
        $scope.$on('$destroy', unsubscribe);
        
        this.dispatch = $ngRedux.dispatch;
    }
    
    showCurrentUserModal() {
        this.dispatch(setCurrentUserModalVisibility(true));
    }

    mapStateToThis(state) {
        return {
            user : state.currentUser && state.currentUser.data,
            isCurrentUserModalVisible : state.modals.currentUser
        };
    }
}
