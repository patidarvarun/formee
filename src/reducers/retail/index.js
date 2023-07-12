
import {SET_RETAIL_SUB_CATEGORIES,SET_ADDRESS_TYPE } from '../../actions/Types';

/** initialize the state */
const INITIAL_STATE = {
    deliveryAddress: '',
    retail_sub_categories: []
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_ADDRESS_TYPE:
            return { ...state, deliveryAddress: action.payload };
        case SET_RETAIL_SUB_CATEGORIES:
            return { ...state, retail_sub_categories: action.payload };
        default:
            return state;
    }
}