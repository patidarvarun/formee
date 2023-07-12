
import {SET_ADDRESS,SET_DIETARY_TYPES,SET_SPORTS_COUNTRY, SET_POPULAR_RESTAURANT, SET_RESTAURANT_CUSTOMER_REVIEWS, SET_FITNESS_TYPES, SET_FOOD_TYPES, SET_RESTAURANT_DETAIL, SET_POPULAR_VENUE } from '../../actions/Types';

/** initialize the state */
const INITIAL_STATE = {
    fitnessPlan: [],
    foodTypes: [],
    restaurantCustomerReviews: [],
    popularRestaurantsList:[],
    popularVenueList:[],
    restaurantDetail: '',
    topCityData: [],
    dietary: [],
    restaurantDefaultAddress: ''

}
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_FITNESS_TYPES:
            return { ...state, fitnessPlan: action.payload.data };
        case SET_FOOD_TYPES:
            return { ...state, foodTypes: action.payload.data };
        case SET_DIETARY_TYPES:
            return { ...state, dietary: action.payload.data };
        case SET_RESTAURANT_DETAIL:            
            return { ...state, restaurantDetail: action.payload };            
        case SET_RESTAURANT_CUSTOMER_REVIEWS:
            return { ...state, restaurantCustomerReviews: action.payload.data };
        case SET_POPULAR_RESTAURANT:
            return { ...state, popularRestaurantsList: action.payload.data };
        case SET_POPULAR_VENUE:
                return { ...state, popularVenueList: action.payload.data };
        case SET_SPORTS_COUNTRY:
            return { ...state, topCityData: action.payload};
        case SET_ADDRESS: 
            return { ...state, restaurantDefaultAddress: action.payload}
        default:
            return state;
    }
}