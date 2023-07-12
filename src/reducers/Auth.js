import { SET_LOGGED_IN_USER } from '../actions/Types';
import { setLocalStorage } from '../common/Methods'

const INITIAL_STATE = {
    loggedInUser: undefined,
    isLoggedIn: false,
    dashboardRoutes:['/myProfile','/editProfile','/change-password','/message','/dashboard','/fitness-vendor-manage-classes']
};

const applySetUserType = (state, action) => ({
    ...state,
    loggedInUser: action.payload.data,
    isLoggedIn: true
});


function authTypeReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case SET_LOGGED_IN_USER: {
            setLocalStorage(action.payload)
            return applySetUserType(state, action);
        }
        default:
            return state;
    }
}

export default authTypeReducer;
