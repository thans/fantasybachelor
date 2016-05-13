import { isAnyModalVisible } from '../selectors/modals';

export default class BlurController {

    constructor($ngRedux, $scope) {
        'ngInject';
        const unsubscribe = $ngRedux.connect((state) => this.mapStateToThis(state), {})(this);
        $scope.$on('$destroy', unsubscribe);
    }

    mapStateToThis(state) {
        return {
            blurActive : isAnyModalVisible(state)
        };
    }
}