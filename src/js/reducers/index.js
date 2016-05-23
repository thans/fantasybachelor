import { combineReducers } from 'redux';
import facebook from './facebook';
import asyncLink from './asyncLink';
import apiKey from './apiKey';
import currentUser from './currentUser';
import contestants from './contestants';
import modals from './modals';
import roles from './roles';
import rounds from './rounds';
import router from './router';
import users from './users';

const reducers = combineReducers({
    router,
    facebook,
    asyncLink,
    apiKey,
    currentUser,
    contestants,
    modals,
    roles,
    rounds,
    users
});

export default reducers;