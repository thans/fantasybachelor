var URLS = {};
URLS.BASE_URL = window.location.hostname === "localhost" ? 'http://localhost:8000' : '';
URLS.GET_WEEKS = URLS.BASE_URL + '/getWeeks';
URLS.GET_CONTESTANTS = URLS.BASE_URL + '/getContestants';
URLS.LOGIN_USER = URLS.BASE_URL + '/loginUser';
URLS.SELECT_CONTESTANT = URLS.BASE_URL + '/selectContestant';
URLS.REMOVE_CONTESTANT = URLS.BASE_URL + '/removeContestant';
URLS.GET_LEADERBOARD = URLS.BASE_URL + '/getLeaderboard';
URLS.GET_STATISTICS = URLS.BASE_URL + '/getStatistics';