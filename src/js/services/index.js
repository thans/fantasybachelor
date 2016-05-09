import angular from 'angular';
import FacebookService from './FacebookService';
import BackendResourceService from './BackendResourceService';

export default angular.module('FantasyBach.services', [])
    .service('facebookService', FacebookService)
    .service('backendResourceService', BackendResourceService)
    .name;
