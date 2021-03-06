import { getCurrentLeagueUsers } from './leagues';
import { createSelector } from 'reselect';
import _find from 'lodash/find';
import _reduce from 'lodash/reduce';
import _values from 'lodash/values';
import _intersection from 'lodash/intersection';
import _each from 'lodash/each';
import _last from 'lodash/last';
import _transform from 'lodash/transform';
import _map from 'lodash/map';
import moment from 'moment';

const getRounds = (state) => state.rounds.data;
const getCurrentRoundId = (state) => state.router.params.roundId;
const getCurrentUser = (state) => state.currentUser.data;

const getCurrentRoundMultipliers = (user, rounds, currentRound) => {
    const multipliers = _reduce(currentRound.eligibleContestantIds, (result, contestantId) => {
        result[contestantId] = 1;
        return result;
    }, {});
    let roundIndex = currentRound.index - 1;
    let multipliableContestantIds = currentRound.eligibleContestantIds;
    while (roundIndex >= 0 && roundIndex > (currentRound.index - currentRound.maximumMultiplier)) {
        const round = rounds[roundIndex];
        const userRoundPickedContestantIds = _values(user.picks[round.id]);
        const newMultipliableContestantIds = _intersection(userRoundPickedContestantIds, multipliableContestantIds);

        _each(newMultipliableContestantIds, (contestantId) => {
            multipliers[contestantId]++;
        });

        multipliableContestantIds = newMultipliableContestantIds;
        roundIndex--;
    }
    return multipliers;
};

export const getActiveRound = createSelector(
    [ getRounds ],
    (rounds) => _find(rounds, (round) => (moment().isAfter(round.startVoteLocalDateTime) && moment().isBefore(round.roundEndLocalDateTime))) || _last(rounds)
);

export const getCurrentRound = createSelector(
    [ getRounds, getCurrentRoundId ],
    (rounds, currentRoundId) => _find(rounds, { id : currentRoundId })
);

export const getCurrentRoundScore = createSelector(
    [ getCurrentRound, getCurrentUser ],
    (currentRound, currentUser) => currentUser.scores[currentRound.id]
);

export const isCurrentRoundPreSelectionOpen = createSelector(
    [ getCurrentRound ],
    (currentRound) => moment().isBefore(currentRound.startVoteLocalDateTime)
);

export const isCurrentRoundSelectionClosed = createSelector(
    [ getCurrentRound ],
    (currentRound) => moment().isAfter(currentRound.endVoteLocalDateTime)
);

// export const isCurrentRoundLastRound = createSelector(
//     [ getRounds, getCurrentRound ],
//     (rounds, currentRound) => _last(rounds) === currentRound
// );
//
// export const getNextRound = createSelector(
//     [ getRounds, getCurrentRound, isCurrentRoundLastRound ],
//     (rounds, currentRound, isCurrentRoundLastRound) => isCurrentRoundLastRound ? null : rounds[currentRound.index + 1]
// );
//
// export const isNextRoundOpen = createSelector(
//     [ getRounds, getCurrentRound, getNextRound, isCurrentRoundLastRound ],
//     ( rounds, currentRound, nextRound, isCurrentRoundLastRound) => isCurrentRoundLastRound ? false : moment().isAfter(nextRound.startVoteLocalDateTime)
// );

export const getCurrentUserCurrentRoundMultipliers = createSelector(
    [ getCurrentUser, getRounds, getCurrentRound ],
    getCurrentRoundMultipliers
);

export const getCurrentLeagueUsersCurrentRoundMultipliers = createSelector(
    [ getCurrentLeagueUsers, getRounds, getCurrentRound ],
    (currentLeagueUsers, rounds, currentRound) => {
        return _transform(currentLeagueUsers, (result, user) => {
            result[user.id] = getCurrentRoundMultipliers(user, rounds, currentRound)
        }, {});
    }
);
