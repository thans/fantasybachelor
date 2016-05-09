import { createSelector } from 'reselect';
import _find from 'lodash/find';
import moment from 'moment';

const getRounds = (state) => state.rounds.data;
const getCurrentRoundId = (state) => state.router.params.roundId;
const getCurrentUser = (state) => state.currentUser.data;

export const getActiveRound = createSelector(
    [ getRounds ],
    (rounds) => _find(rounds, (round) => (moment().isAfter(round.startVoteLocalDateTime) && moment().isBefore(round.roundEndLocalDateTime)) || round.id === 'round:Vk6kVRWIl')
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