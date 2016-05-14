export default function viewBioSection() {
    return {
        restrict : 'E',
        controller : ViewBioSectionController,
        controllerAs : 'viewBioSection',
        bindToController: true,
        templateUrl : VIEWS_DIR + '/contestantSelectionSections/viewBioSection.html',
        scope : {}
    };
}

class ViewBioSectionController {

    constructor($ngRedux, $scope) {
        'ngInject';
        const unsubscribe = $ngRedux.connect(this.mapStateToThis, null)(this);
        $scope.$on('$destroy', unsubscribe);
    }

    mapStateToThis(state) {
        return {
            contestant : state.modals.contestantSelection.data.contestant
        }
    }
}
