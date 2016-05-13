import { createSelector } from 'reselect'
import _mapValues from 'lodash/mapValues';
import _reduce from 'lodash/reduce';
import _find from 'lodash/find';
import _size from 'lodash/size';
import _includes from 'lodash/includes';
import _sortBy from 'lodash/sortBy';
import _values from 'lodash/values';
import { getCurrentRound } from './rounds';

const getContestantById = (contestants, contestantId) => _find(contestants, { id : contestantId });

const getContestants = (state) => state.contestants.data;
const getCurrentUser = (state) => state.currentUser.data;

export const getCurrentRoundSelectedContestants = createSelector(
    [ getContestants, getCurrentRound, getCurrentUser ],
    (contestants, currentRound, currentUser) => 
        _mapValues(currentUser.picks[currentRound.id], contestantId => 
            getContestantById(contestants, contestantId))
);

export const getNumCurrentRoundSelectedContestants = createSelector(
    [ getCurrentRoundSelectedContestants ],
    (currentRoundSelectedContestants) => _size(currentRoundSelectedContestants)
);

export const isCurrentRoundSelectionFull = createSelector(
    [ getCurrentRound, getNumCurrentRoundSelectedContestants ],
    (currentRound, numCurrentRoundSelectedContestants) => currentRound.rosterSize === numCurrentRoundSelectedContestants
);

export const getPrimaryContestant = createSelector(
    [ getContestants ],
    (contestants) => _find(contestants, { isPrimaryContestant : true })
);

export const getCurrentRoundEligibleContestants = createSelector(
    [ getContestants, getCurrentRound, getCurrentRoundSelectedContestants ],
    (contestants, currentRound, currentRoundSelectedContestants) => {
        const selectedContestants = _values(currentRoundSelectedContestants);
        return _sortBy(_reduce(currentRound.eligibleContestantIds, (result, eligibleontestantId) => {
            const eligibleContestant = _find(contestants, { id : eligibleontestantId });
            if (!_includes(selectedContestants, eligibleContestant)) {
                result.push(eligibleContestant);
            }
            return result;
        }, []), 'name')
    }
);