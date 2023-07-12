
import { SET_GENERAL_VENDOR_MY_OFFER } from '../../../actions/Types';

/** initialize the state */
const INITIAL_STATE = {
    generalMyOffer: [],
}
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_GENERAL_VENDOR_MY_OFFER:
            return { ...state, generalMyOffer: action.payload.data.data };
        default:
            return state;
    }
}