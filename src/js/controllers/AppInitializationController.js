import { getInitializationState } from '../selectors/initialization';

export default class AppInitializationController {

    constructor($ngRedux, $scope, backendResourceService) {
        'ngInject';
        const unsubscribe = $ngRedux.connect((state) => this.mapStateToThis(state), {})(this);
        $scope.$on('$destroy', unsubscribe);

        let apiKeyStateUnsubscribe = $scope.$watch(() => { return this.apiKeyLoaded; }, (apiKeyLoaded) => {
            if (!apiKeyLoaded) { return; }
            $ngRedux.dispatch(backendResourceService.getCurrentUser());
            $ngRedux.dispatch(backendResourceService.getContestants());
            $ngRedux.dispatch(backendResourceService.getRoles());
            $ngRedux.dispatch(backendResourceService.getRounds());
            apiKeyStateUnsubscribe();
        });
    }

    mapStateToThis(state) {
        return getInitializationState(state);
    }
}