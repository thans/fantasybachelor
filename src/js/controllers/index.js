import angular from 'angular';
import AppInitializationController from './AppInitializationController';
import LoginButtonController from './LoginButtonController';

export default angular.module('FantasyBach.controllers', [])
    .controller('AppInitializationController', AppInitializationController)
    .controller('LoginButtonController', LoginButtonController)
    .name;
