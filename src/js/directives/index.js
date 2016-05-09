import angular from 'angular';
import heading from './heading';
import contestantButton from './contestantButton';
import currentUserModal from './currentUserModal';
import roundModal from './roundModal';
import asyncLink from './asyncLink';

export default angular.module('FantasyBach.directives', [])
    .directive('heading', heading)
    .directive('contestantButton', contestantButton)
    .directive('currentUserModal', currentUserModal)
    .directive('roundModal', roundModal)
    .directive('asyncLink', asyncLink)
    .name;
