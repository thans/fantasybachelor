app.factory('contestantFactory', ['$rootScope', 'backendFactory', function($rootScope, backendFactory) {
    var contestantFactory = {};

    contestantFactory.promise = backendFactory.loadContestants().then(function(response) {
        var contestants = response.data;
        contestantFactory.contestants = contestants;
        console.log(contestants);
        console.log('Contestant data loaded.');
        return contestants;
    });

    contestantFactory.findContestantById = function(id) {
        if (!contestantFactory.contestants) { return; }
        return _.find(contestantFactory.contestants, {id : id});
    };

    return contestantFactory;
}]);