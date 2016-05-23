import { FantasyBachSdk } from 'fantasybach-sdk';

// const CURRENT_SEASON_ID = 'season:NJWJTpZ8x';
const CURRENT_SEASON_ID = 'season:HyfVRTasf';

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
    USERS : 'USERS',
    NICKNAME : 'NICKNAME',
    CONTESTANTS : 'CONTESTANTS',
    ROLES : 'ROLES',
    ROUNDS : 'ROUNDS'
};

export default class BackendResourceService {

    constructor($ngRedux, $state) {
        'ngInject';
        this.backendSdk = new FantasyBachSdk();
        this.$ngRedux = $ngRedux;
        this.$state = $state;
    }

    mapToSdk(sdkFunction, resourceType, params, body, resultMapper) {
        return (dispatch) => {
            dispatch({
                type : BACKEND_RESOURCE_STATE_CHANGE,
                state : BACKEND_RESOURCE_STATE.LOADING,
                resourceType : resourceType
            });
            sdkFunction.call(this.backendSdk, params || {}, body || {}).then((result) => {
                let mappedResult = result;
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

    getUsers(userIds) {
        return this.mapToSdk(this.backendSdk.getUsersById, BACKEND_RESOURCE_TYPE.USERS, { seasonId : CURRENT_SEASON_ID, ids : userIds.join(',') });
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

    postPick(round, contestant, role) {
        return this.mapToSdk(this.backendSdk.postPick, BACKEND_RESOURCE_TYPE.CURRENT_USER, { seasonId : CURRENT_SEASON_ID, roundId : round.id }, { contestantId : contestant.id, roleId : role.id }, () => {
            const state = this.$ngRedux.getState();
            const currentUser = Object.assign({}, state.currentUser.data);
            currentUser.picks[round.id][role.id] = contestant.id;
            return currentUser;
        });
    }

    deletePick(round, contestant, role) {
        return this.mapToSdk(this.backendSdk.deletePick, BACKEND_RESOURCE_TYPE.CURRENT_USER, { seasonId : CURRENT_SEASON_ID, roundId : round.id }, { contestantId : contestant.id, roleId : role.id }, () => {
            const state = this.$ngRedux.getState();
            const currentUser = Object.assign({}, state.currentUser.data);
            currentUser.picks[round.id][role.id] = null;
            return currentUser;
        });
    }

    postLeague(leagueName) {
        return this.mapToSdk(this.backendSdk.postLeague, BACKEND_RESOURCE_TYPE.CURRENT_USER, { seasonId : CURRENT_SEASON_ID }, { leagueName : leagueName }, (leagueId) => {
            const state = this.$ngRedux.getState();
            const currentUser = Object.assign({}, state.currentUser.data);
            currentUser.leagues.push({
                id : leagueId,
                name : leagueName,
                adminId : currentUser.id,
                memberIds : [ currentUser.id ]
            });
            this.$state.go('round', Object.assign({}, this.$state.params, {
                leagueId : leagueId
            }));
            return currentUser;
        });
    }

    postJoinLeague(leagueId) {
        return this.mapToSdk(this.backendSdk.postLeagueJoin, BACKEND_RESOURCE_TYPE.CURRENT_USER, { seasonId : CURRENT_SEASON_ID, leagueId : leagueId }, {}, (league) => {
            const state = this.$ngRedux.getState();
            const currentUser = Object.assign({}, state.currentUser.data);
            currentUser.leagues.push(league);
            this.$state.go('round', Object.assign({}, this.$state.params, {
                leagueId : leagueId
            }), {
                location : 'replace'
            });
            return currentUser;
        });
    }
}
