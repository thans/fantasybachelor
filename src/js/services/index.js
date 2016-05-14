import angular from 'angular';
import FacebookService from './FacebookService';
import ContestantSelectionService from './ContestantSelectionService';
import BackendResourceService from './BackendResourceService';

export default angular.module('FantasyBach.services', [])
    .service('facebookService', FacebookService)
    .service('backendResourceService', BackendResourceService)
    .service('contestantSelectionService', ContestantSelectionService)
    .name;
