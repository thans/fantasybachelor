export const ROUTE_CHANGE = 'ROUTE_CHANGE';

export default function router($rootScope, $state, $ngRedux) {
    'ngInject';
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        $ngRedux.dispatch({
            type : ROUTE_CHANGE,
            state : toState.name,
            params : toParams
        });
    });

    $rootScope.$on('$stateChangeError', () => {
        $state.go('welcome', {}, {
            location : 'replace'
        });
    });
}