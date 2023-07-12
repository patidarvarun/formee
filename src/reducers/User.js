import { GET_USER_PROFILE, GET_TRADER_PROFILE } from '../actions/Types';

const INITIAL_STATE = {
    userProfile: null,
    traderProfile: null
};

const getUserProfile = (state, action) => ({
    ...state,
    userProfile: action.payload.data
});

const getTraderProfile = (state, action) => ({
    ...state,
    traderProfile: action.payload.data
});
function userTypeReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case GET_USER_PROFILE: {
            return getUserProfile(state, action);
        }
        case GET_TRADER_PROFILE: {
            return getTraderProfile(state, action);
        }
        default:
            return state;
    }
}

export default userTypeReducer;