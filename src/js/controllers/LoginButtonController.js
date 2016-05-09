export default class LoginButtonController {

    constructor($ngRedux, $scope, facebookService) {
        'ngInject';
        const unsubscribe = $ngRedux.connect(null, { login : () => facebookService.login() })(this);
        $scope.$on('$destroy', unsubscribe);
    }
}