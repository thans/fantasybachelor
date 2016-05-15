export default class LeagueJoinController {

    constructor($ngRedux, $scope, $state, backendResourceService) {
        'ngInject';
        const unsubscribe = $ngRedux.connect((state) => this.mapStateToThis(state), {})(this);
        $scope.$on('$destroy', unsubscribe);

        let currentUserStateUnsubscribe = $scope.$watch(() => { return this.currentUser.data; }, (currentUser) => {
            if (!currentUser) { return; }
            console.log('YAY!!!');
            const routerParams = this.router.params;
            const leagueId = routerParams.leagueId;

            backendResourceService.postJoinLeague(leagueId).then(function() {
                $state.go('round', Object.assign({}, routerParams, {
                    leagueId : leagueId
                }), {
                    location : 'replace'
                });
            });
            currentUserStateUnsubscribe();
        });
    }

    mapStateToThis(state) {
        return {
            currentUser : state.currentUser,
            router : state.router
        };
    }
}