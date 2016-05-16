import { createSelector } from 'reselect';
import _find from 'lodash/find';

const getLeagues = (state) => state.currentUser.data.leagues;
const getCurrentLeagueId = (state) => state.router.params.leagueId;
const getCurrentUser = (state) => state.currentUser.data;

export const getCurrentLeague = createSelector(
    [ getLeagues, getCurrentLeagueId ],
    (leagues, currentLeagueId) => _find(leagues, { id : currentLeagueId })
);

export const isCurrentUserCurrentLeagueAdmin = createSelector(
    [ getCurrentUser, getCurrentLeague ],
    (currentUser, currentLeague) => currentLeague.adminId === currentUser.id
);