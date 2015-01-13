app.factory('userFactory', ['$rootScope', '$q', 'backendFactory', 'routeFactory', function($rootScope, $q, backendFactory, routeFactory) {
    var userFactory = {};

    userFactory.promise = backendFactory.getUser().then(function(response) {
        var user = response.data;
        user.displayName = user.alias || user.displayName || user.userName || user.firstName + ' ' + user.lastName;
        userFactory.user = user;

        console.log(user);
        console.log('User data loaded.');

        return user;
    });
    $rootScope.$watchCollection(function() { return userFactory.user; }, function(user) {
        if (!user) { return; }
        user.displayName = user.alias || user.displayName || user.userName || user.firstName + ' ' + user.lastName;
    });

    var aliasDeferred = $q.defer();
    userFactory.promise.then(function(user) {
        if (user.alias) {
            aliasDeferred.resolve(user.alias);
            return;
        }
        $rootScope.appLoaded = true;
        routeFactory.goToChangeAlias();
    }, function(err) {
        aliasDeferred.reject(err);
    });
    $rootScope.$watch(function() { return userFactory.user && userFactory.user.alias; }, function(alias) {
        if (alias) { aliasDeferred.resolve(userFactory.user.alias); }
    });
    userFactory.aliasPromise = aliasDeferred.promise;

    return userFactory;
}]);