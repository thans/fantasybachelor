var SELECTION_MODES = {
    CONTESTANT_UNSELECTABLE: 'Unselected', // This contestant can't be selected under any circumstance
    SELECTION_CLOSED: 'Selection Closed', // Out of the time frame to select contestants
    SELECTION_FULL: 'Selection Full', // All of the available selections are taken
    REMOVABLE: 'Remove Me', // The contestant is selected and is therefore unselectable
    CHOOSABLE: 'Choose Me' // THe contestant is unselected and is therefore selectable
}