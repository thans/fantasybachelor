export const ROUTE_CHANGE = 'ROUTE_CHANGE';

export default function router($rootScope, $state, $ngRedux) {
    'ngInject';
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        console.log('start: ' + toState.name);
        $ngRedux.dispatch({
            type : ROUTE_CHANGE,
            state : toState.name,
            params : toParams
        });
    });

    $rootScope.$on('$stateChangeError', (event, toState, toParams, fromState, fromParams, error) => {
        console.log('error');
        console.log(event);
        console.log(toState);
        console.log(toParams);
        console.log(fromState);
        console.log(fromParams);
        console.log(error);
        $state.go('welcome', {}, {
            location : 'replace'
        });
    });
}