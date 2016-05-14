export default function roleInfoSection() {
    return {
        restrict : 'E',
        controller : RoleInfoSectionController,
        controllerAs : 'roleInfoSection',
        bindToController: true,
        templateUrl : VIEWS_DIR + '/contestantSelectionSections/roleInfoSection.html',
        scope : {}
    };
}

class RoleInfoSectionController {

    constructor($ngRedux, $scope) {
        'ngInject';
        const unsubscribe = $ngRedux.connect(this.mapStateToThis, null)(this);
        $scope.$on('$destroy', unsubscribe);
    }

    mapStateToThis(state) {
        return {
            role : state.modals.contestantSelection.data.role
        }
    }
}
