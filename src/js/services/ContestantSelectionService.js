export default class ContestantSelectionService {

    constructor(backendResourceService) {
        'ngInject';
        this.backendResourceService = backendResourceService;
    }

    selectContestant(contestant, role) {
        console.log('selecting contestant');
    }

    removeContestant(contestant) {
        console.log('removing contestant');
    }
}