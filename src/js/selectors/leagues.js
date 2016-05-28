import { createSelector } from 'reselect';
import _find from 'lodash/find';
import _map from 'lodash/map';
import _orderBy from 'lodash/orderBy';
import _compact from 'lodash/compact';

const getLeagues = (state) => state.currentUser.data.leagues;
const getCurrentLeagueId = (state) => state.router.params.leagueId;
const getCurrentUser = (state) => state.currentUser.data;
const getUsers = (state) => state.users.data;

export const getCurrentLeague = createSelector(
    [ getLeagues, getCurrentLeagueId ],
    (leagues, currentLeagueId) => _find(leagues, { id : currentLeagueId })
);

export const isCurrentUserCurrentLeagueAdmin = createSelector(
    [ getCurrentUser, getCurrentLeague ],
    (currentUser, currentLeague) => currentLeague && currentLeague.adminId === currentUser.id
);

export const getCurrentLeagueUsers = createSelector(
    [ getCurrentLeague, getUsers ],
    (currentLeague, users) => {
        return _orderBy(_compact(_map(currentLeague.memberIds, (memberId) => users[memberId])), 'scores.score', 'desc');
    }
);