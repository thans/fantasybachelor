import angular from 'angular';
import eventTime from './eventTime';

export default angular.module('FantasyBach.filters', [])
    .filter('eventTime', eventTime)
    .name;
