export const SDK_INITIALIZED = 'FACEBOOK.SDK_INITIALIZED';
export const AUTH_STATE_CHANGE = 'FACEBOOK.AUTH_STATE_CHANGE';

const SCOPE = 'email,public_profile';

export const AUTH_STATE = {
    UNKNOWN : 'UNKNOWN',
    AUTHENTICATED : 'AUTHENTICATED',
    NOT_AUTHENTICATED : 'NOT_AUTHENTICATED'
};

const DEV_APP_ID = '307416292730318';
const PROD_APP_ID = '307416292730318';

export default class FacebookService {

    constructor(backendResourceService) {
        'ngInject';
        this.backendResourceService = backendResourceService;
        this.isInitialized = false;
    }

    static getAppId() {
        return window.location.hostname === 'localhost' ? DEV_APP_ID : PROD_APP_ID;
    };

    init() {
        return dispatch => {
            FB.init({
                appId      : FacebookService.getAppId(), // App ID
                channelUrl : 'channel.html', // Channel File
                status     : true, // check login status
                xfbml      : true, // parse XFBML,
                version    : 'v2.5'
            });

            dispatch({
                type : SDK_INITIALIZED
            });

            dispatch(this.checkAuthentication(false));
        };
    }

    checkAuthentication(force) {
        return dispatch => {
            if (!FB) { return; }

            FB.getLoginStatus(response => {
                if (response && response.status == 'connected' && response.authResponse && response.authResponse.accessToken) {
                    let authToken = response.authResponse.accessToken;
                    dispatch(this.backendResourceService.getApiKey(authToken));
                    return dispatch({
                        type : AUTH_STATE_CHANGE,
                        authToken : authToken
                    });
                }
                dispatch({
                    type : AUTH_STATE_CHANGE,
                    authToken : null
                });
            }, force);
        };
    }

    login() {
        return dispatch => {
            if (!FB) { return; }

            FB.login(response => {
                if (response && response.authResponse && response.authResponse.accessToken) {
                    let authToken = response.authResponse.accessToken;
                    dispatch(this.backendResourceService.getApiKey(authToken));
                    return dispatch({
                        type : AUTH_STATE_CHANGE,
                        authToken : authToken
                    });
                }
            }, { scope: SCOPE });
        }
    }

    logout() {
        return dispatch => {
            if (!FB) { return; }

            FB.logout(() => {
                dispatch({
                    type : AUTH_STATE_CHANGE,
                    authToken : null
                });
                dispatch(this.backendResourceService.clearApiKey());
            }, { scope: SCOPE });
        }
    }
}