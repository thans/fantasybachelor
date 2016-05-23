import { getInitializationState } from '../selectors/initialization';

export default class AppInitializationController {

    constructor($ngRedux, $scope, $interval, backendResourceService, facebookService) {
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

        const apiKeyUpdateInterval = $interval(() => {
            if (!this.apiKeyLoaded) { return; }
            $ngRedux.dispatch(facebookService.checkAuthentication(true));
        }, 5 * 60 * 1000);
        $scope.$on('$destroy', () => $interval.cancel(apiKeyUpdateInterval));
    }

    mapStateToThis(state) {
        return getInitializationState(state);
    }
}