export default class WelcomeController {

    constructor($scope, $timeout) {
        'ngInject';

        $timeout(() => {
            this.showContestant1 = true;
        }, 2500 + (Math.random() - .5) * 1000);

        $timeout(() => {
            this.showContestant2 = true;
        }, 2500 + (Math.random() - .5) * 1000);

        $timeout(() => {
            this.showContestant3 = true;
        }, 2500 + (Math.random() - .5) * 1000);

        $timeout(() => {
            this.showContestant4 = true;
        }, 2500 + (Math.random() - .5) * 1000);

        $timeout(() => {
            this.showContestant5 = true;
        }, 2500 + (Math.random() - .5) * 1000);

        $timeout(() => {
            this.showContestant6 = true;
        }, 2500 + (Math.random() - .5) * 1000);
    }
}