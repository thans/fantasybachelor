var app = angular.module('FantasyBach', ['ngRoute']);

app.run(['weeksFactory', function(weeksFactory) {}]);

app.run(function() {
    FastClick.attach(document.body);
});