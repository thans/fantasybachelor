import angular from 'angular';
import fastclick from './fastclick';
import router from './router';
import facebookSdk from './facebookSdk';

export default angular.module('FantasyBach.run', [])
    .run(fastclick)
    .run(router)
    .run(facebookSdk)
    .name;
