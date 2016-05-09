import { createSelector } from 'reselect'
import { AUTH_STATE } from '../services/FacebookService';
import { BACKEND_RESOURCE_STATE } from '../services/BackendResourceService';

const getAsyncLink = (state) => state.asyncLink;
const getApiKey = (state) => state.apiKey;
const getFacebook = (state) => state.facebook;
const getCurrentUser = (state) => state.currentUser;
const getContestants = (state) => state.contestants;
const getRoles = (state) => state.roles;
const getRounds = (state) => state.rounds;

let initialized = false;

export const getInitializationState = createSelector(
    [ getAsyncLink, getApiKey, getFacebook, getCurrentUser, getContestants, getRoles, getRounds ],
    (asyncLink, apiKey, facebook, currentUser, contestants, roles, rounds) => {
        
        let isAppInitialized = () => {
            if (!asyncLink.allLoaded) {
                return false;
            }
            switch (facebook.authState) {
                case AUTH_STATE.UNKNOWN : return false;
                case AUTH_STATE.NOT_AUTHENTICATED : return true;
                case AUTH_STATE.AUTHENTICATED :
                    return currentUser.state == BACKEND_RESOURCE_STATE.LOADED
                        && contestants.state == BACKEND_RESOURCE_STATE.LOADED
                        && roles.state == BACKEND_RESOURCE_STATE.LOADED
                        && rounds.state == BACKEND_RESOURCE_STATE.LOADED;
            } 
        };

        initialized = initialized || isAppInitialized();
        
        return {
            apiKeyLoaded : apiKey.state === BACKEND_RESOURCE_STATE.LOADED && apiKey.data,
            authenticated : facebook.authState === AUTH_STATE.AUTHENTICATED,
            initialized : initialized
        }
    }
);