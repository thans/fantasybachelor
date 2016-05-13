import { createSelector } from 'reselect';
const getModals = (state) => state.modals;

export const isAnyModalVisible = createSelector(
    [ getModals ],
    (modals) => modals.round || modals.currentUser || modals.contestantSelection.visible
);