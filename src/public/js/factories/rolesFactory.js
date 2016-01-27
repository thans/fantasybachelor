app.factory('rolesFactory', ['$rootScope', 'SEASON', 'backendFactory', function($rootScope, SEASON, backendFactory) {
    var rolesFactory = {};

    rolesFactory.loadRoles = function() {
        backendFactory.getRoles().then(function(roles) {
            console.log(roles);
            rolesFactory.roles = roles;
        });
    };

    rolesFactory.findRoleById = function(id) {
        if (!rolesFactory.roles) { return; }
        return _.find(rolesFactory.roles, {id : id});
    };

    return rolesFactory;
}]);
