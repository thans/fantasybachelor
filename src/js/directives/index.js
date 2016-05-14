import angular from 'angular';
import heading from './heading';
import contestantButton from './contestantButton';
import currentUserModal from './currentUserModal';
import roundModal from './roundModal';
import contestantSelectionModal from './contestantSelectionModal';
import asyncLink from './asyncLink';
import contestantSelectionSections from './contestantSelectionSections';

export default angular.module('FantasyBach.directives', [ contestantSelectionSections ])
    .directive('heading', heading)
    .directive('contestantButton', contestantButton)
    .directive('currentUserModal', currentUserModal)
    .directive('roundModal', roundModal)
    .directive('contestantSelectionModal', contestantSelectionModal)
    .directive('asyncLink', asyncLink)
    .name;
