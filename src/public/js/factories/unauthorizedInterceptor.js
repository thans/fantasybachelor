app.factory('unauthorizedInterceptor', ['$q', '$location', '$rootScope', 'ROUTES', function($q, $location, $rootScope, ROUTES) {
    return {
        responseError : function(response) {
            if (response.status === 401) {
                // Copied in routeFactory
                $rootScope.appLoaded = true;
                $location.path(ROUTES.LOGIN);
            }
            return $q.reject(response);
        }
    }
}]);