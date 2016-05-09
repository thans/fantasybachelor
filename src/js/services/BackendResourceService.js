import { FantasyBachSdk } from 'fantasybach-sdk';

const CURRENT_SEASON_ID = 'season:NJWJTpZ8x';

export const BACKEND_RESOURCE_STATE_CHANGE = 'BACKEND_RESOURCE_STATE_CHANGE';

export const BACKEND_RESOURCE_STATE = {
    UNKNOWN : 'UNKNOWN',
    LOADING : 'LOADING',
    LOADED : 'LOADED',
    ERROR : 'ERROR'
};

export const BACKEND_RESOURCE_TYPE = {
    API_KEY : 'API_KEY',
    CURRENT_USER : 'CURRENT_USER',
    NICKNAME : 'NICKNAME',
    CONTESTANTS : 'CONTESTANTS',
    ROLES : 'ROLES',
    ROUNDS : 'ROUNDS'
};

export default class BackendResourceService {

    constructor() {
        this.backendSdk = new FantasyBachSdk();
    }

    mapToSdk(sdkFunction, resourceType, params, body, resultMapper) {
        return (dispatch) => {
            dispatch({
                type : BACKEND_RESOURCE_STATE_CHANGE,
                state : BACKEND_RESOURCE_STATE.LOADING,
                resourceType : resourceType
            });
            sdkFunction.call(this.backendSdk, params || {}, body || {}).then((result) => {
                let mappedResult = result.data;
                if (resultMapper) {
                    mappedResult = resultMapper(result);
                }
                dispatch({
                    type : BACKEND_RESOURCE_STATE_CHANGE,
                    state : BACKEND_RESOURCE_STATE.LOADED,
                    resourceType : resourceType,
                    data : mappedResult
                });
            }).catch(function(err) {
                dispatch({
                    type : BACKEND_RESOURCE_STATE_CHANGE,
                    state : BACKEND_RESOURCE_STATE.ERROR,
                    resourceType : resourceType,
                    data : err
                });
            });
        }
    }

    getApiKey(fbAccessToken) {
        return this.mapToSdk(this.backendSdk.login, BACKEND_RESOURCE_TYPE.API_KEY, { token : fbAccessToken });
    }

    clearApiKey() {
        return (dispatch) => {
            this.backendSdk.config.accessKey = '';
            this.backendSdk.config.secretKey = '';
            this.backendSdk.config.sessionToken = '';
            dispatch({
                type : BACKEND_RESOURCE_STATE_CHANGE,
                state : BACKEND_RESOURCE_STATE.LOADED,
                resourceType : BACKEND_RESOURCE_TYPE.API_KEY,
                data : null
            });
        }
    }

    getCurrentUser() {
        return this.mapToSdk(this.backendSdk.getCurrentUser, BACKEND_RESOURCE_TYPE.CURRENT_USER, { seasonId : CURRENT_SEASON_ID });
    }

    getContestants() {
        return this.mapToSdk(this.backendSdk.getContestants, BACKEND_RESOURCE_TYPE.CONTESTANTS, { seasonId : CURRENT_SEASON_ID });
    }

    getRoles() {
        return this.mapToSdk(this.backendSdk.getRoles, BACKEND_RESOURCE_TYPE.ROLES, { seasonId : CURRENT_SEASON_ID });
    }

    getRounds() {
        return this.mapToSdk(this.backendSdk.getRounds, BACKEND_RESOURCE_TYPE.ROUNDS, { seasonId : CURRENT_SEASON_ID });
    }

    postNickname(nickname) {
        return this.mapToSdk(this.backendSdk.postNickname, BACKEND_RESOURCE_TYPE.NICKNAME, {}, { nickname : nickname }, () => { return nickname; });
    }
}

// app.factory('backendFactory', ['$q', '$rootScope', 'SEASON', function($q, $rootScope, SEASON) {
//     var backendSdk = new FantasyBachSdk();
//
//     var backendFactory = {};
//
//     var mapToSdk = function(sdkFunction, params, body, resultMapper) {
//         return $q(function(resolve, reject) {
//             sdkFunction.call(backendSdk, params || {}, body || {}).then(function(result) {
//                 var mappedResult = result.data;
//                 if (resultMapper) {
//                     mappedResult = resultMapper(result);
//                 }
//                 resolve(mappedResult);
//                 $rootScope.$apply();
//             }).catch(function(err) {
//                 reject(err);
//                 $rootScope.$apply();
//             });
//         });
//     };
//
//     backendFactory.login = function(fbAccessToken) {
//         return mapToSdk(backendSdk.login, { token : fbAccessToken });
//     };
//
//     backendFactory.getCurrentUser = function() {
//         return mapToSdk(backendSdk.getCurrentUser, { seasonId : SEASON.CURRENT_SEASON_ID });
//     };
//
//     backendFactory.getContestants = function() {
//         return mapToSdk(backendSdk.getContestants, { seasonId : SEASON.CURRENT_SEASON_ID });
//     };
//
//     backendFactory.getRoles = function() {
//         return mapToSdk(backendSdk.getRoles, { seasonId : SEASON.CURRENT_SEASON_ID });
//     };
//
//     backendFactory.getRounds = function() {
//         return mapToSdk(backendSdk.getRounds, { seasonId : SEASON.CURRENT_SEASON_ID });
//     };
//
//     backendFactory.getTopUsers = function() {
//         return mapToSdk(backendSdk.getTopUsers, { seasonId : SEASON.CURRENT_SEASON_ID });
//     };
//
//     backendFactory.postNickname = function(nickname) {
//         return mapToSdk(backendSdk.postNickname, {}, { nickname : nickname });
//     };
//
//     backendFactory.postPick = function(roundId, contestantId, roleId) {
//         return mapToSdk(backendSdk.postPick, { seasonId : SEASON.CURRENT_SEASON_ID, roundId : roundId }, { contestantId : contestantId, roleId : roleId });
//     };
//
//     backendFactory.deletePick = function(roundId, contestantId, roleId) {
//         return mapToSdk(backendSdk.deletePick, { seasonId : SEASON.CURRENT_SEASON_ID, roundId : roundId }, { contestantId : contestantId, roleId : roleId });
//     };
//
//     return backendFactory;
// }]);
