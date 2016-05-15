import angular from 'angular';
import angularAnimate from 'angular-animate';
import angularTouch from 'angular-touch';
import angularUiRouter from 'angular-ui-router';
import ngRedux from 'ng-redux';
import config from './config';
import controllers from './controllers';
import directives from './directives';
import run from './run';
import services from './services';
import filters from './filters';
import templates from './build/templates';

module.exports = angular.module('FantasyBach', [
    ngRedux,
    angularUiRouter,
    angularAnimate,
    angularTouch,
    config,
    controllers,
    directives,
    run,
    services,
    filters,
    templates
]);
