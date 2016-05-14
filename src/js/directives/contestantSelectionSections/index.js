import angular from 'angular';
import selectContestantSection from './selectContestantSection';
import selectRoleSection from './selectRoleSection';
import removeContestantSection from './removeContestantSection';
import viewBioSection from './viewBioSection';
import roleInfoSection from './roleInfoSection';
import preSelectionOpenSection from './preSelectionOpenSection';
import selectionClosedSection from './selectionClosedSection';

export default angular.module('FantasyBach.directives.contestantSelectionSections', [])
    .directive('selectContestantSection', selectContestantSection)
    .directive('selectRoleSection', selectRoleSection)
    .directive('removeContestantSection', removeContestantSection)
    .directive('viewBioSection', viewBioSection)
    .directive('roleInfoSection', roleInfoSection)
    .directive('preSelectionOpenSection', preSelectionOpenSection)
    .directive('selectionClosedSection', selectionClosedSection)
    .name;
