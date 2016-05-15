import { getInitializationState } from '../selectors/initialization';
import { getActiveRound } from '../selectors/rounds';
import _find from 'lodash/find';
import RoundController from '../controllers/RoundController';

export default ($stateProvider, $urlRouterProvider) => {
    'ngInject';

    const createAuthorizationPromises = ($q, $ngRedux) => {
        const authorizedDeferred = $q.defer();
        const unauthorizedDeferred = $q.defer();

        const handleChange = () => {
            const initializationState = getInitializationState($ngRedux.getState());

            if (!initializationState.initialized) { return; }
            unauthorizedDeferred.resolve();

            initializationState.authenticated ? authorizedDeferred.resolve() : authorizedDeferred.reject();

            unsubscribe();
        };
        const unsubscribe = $ngRedux.subscribe(handleChange);
        handleChange();

        return {
            authorized : authorizedDeferred.promise,
            unauthorized : unauthorizedDeferred.promise
        }
    };

    const authorizedPromise = ($q, $ngRedux) => {
        'ngInject'

        return createAuthorizationPromises($q, $ngRedux).authorized;
    };

    const unauthorizedPromise = ($q, $ngRedux) => {
        'ngInject'

        return createAuthorizationPromises($q, $ngRedux).unauthorized;
    };

    // see: https://github.com/angular-ui/ui-router/issues/2183
    $urlRouterProvider.otherwise(($injector, $location) => {
        var $state = $injector.get('$state');
        $state.go('round', {}, {
            location : 'replace'
        });
    });

    $stateProvider
        .state('welcome', {
            url : '/welcome',
            templateUrl : 'welcome.html',
            resolve : {
                unauthorized : unauthorizedPromise
            }
        })
        .state('help', {
            url : '/help',
            templateUrl : 'contestant.html',
            resolve : {
                unauthorized : unauthorizedPromise
            }
        })
        .state('round', {
            url : '/round/:roundId/league/:leagueId',
            templateUrl : 'round.html',
            resolve : {
                authorized : authorizedPromise,
                defaultRoundParams : ($q, $state, $ngRedux, $timeout) => {
                    const deferred = $q.defer();

                    const handleChange = () => {
                        const state = $ngRedux.getState();
                        const initializationState = getInitializationState(state);
                        const routerParams = state.router.params;
                        const roundId = routerParams.roundId;
                        const leagueId = routerParams.leagueId;

                        if (!initializationState.initialized) { return; }
                        const activeRound = getActiveRound(state);

                        if (!roundId || !_find(state.rounds.data, { id : roundId })) {
                            deferred.reject();
                            $timeout(() => {
                                $state.go('round', Object.assign({}, routerParams, {
                                    roundId : activeRound.id
                                }), {
                                    location : 'replace'
                                });
                            });
                        } else if (!leagueId) {
                            deferred.reject();
                            $timeout(() => {
                                $state.go('round', Object.assign({}, routerParams, {
                                    leagueId : 'test6'
                                }), {
                                    location : 'replace'
                                });
                            });
                        } else {
                            deferred.resolve();
                        }
                        unsubscribe();
                    };
                    const unsubscribe = $ngRedux.subscribe(handleChange);
                    handleChange();

                    return deferred.promise;
                }
            },
            controller : RoundController,
            controllerAs : 'round',
            bindToController: true
        });
}