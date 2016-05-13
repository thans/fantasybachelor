import angular from 'angular';
import AppInitializationController from './AppInitializationController';
import LoginButtonController from './LoginButtonController';
import BlurController from './BlurController';

export default angular.module('FantasyBach.controllers', [])
    .controller('AppInitializationController', AppInitializationController)
    .controller('LoginButtonController', LoginButtonController)
    .controller('BlurController', BlurController)
    .name;
