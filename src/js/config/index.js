import angular from 'angular';
import reducer from './reducer';
import stateProvider from './stateProvider';
import strictContextualEscaping from './strictContextualEscaping';

export default angular.module('FantasyBach.config', [])
    .config(reducer)
    .config(stateProvider)
    .config(strictContextualEscaping)
    .name;
