
import {GET_SELETED_HOTEL,SET_HOTEL_SEARCH_DATA, SET_HOTEL_REQ_DATA ,SET_SELECTED_CAR_DATA,SET_CAR_SEARCH_DATA,SET_CAR_REQ_DATA,SET_ORIGIN,SET_TOKEN,SET_FLIGHT_SERACH_PARAMS,SET_FLIGHT_RECORD,SET_MULTICITY_VALUE } from '../../actions/Types';

/** initialize the state */
const INITIAL_STATE = {
    flightRecords: '',
    multi_city_Initial: [],
    flight_search_params: '',
    random_token: '',
    current_origin: '',
    car_reqdata: '',
    carList: '',
    selectedCar: '',
    hotelSearchList: '',
    hotelReqdata: '',
    selectedHotel:''
}
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_FLIGHT_RECORD:
            return { ...state, flightRecords: action.payload };
        case SET_MULTICITY_VALUE:
            return { ...state, multi_city_Initial: action.payload };
        case SET_FLIGHT_SERACH_PARAMS:
            return { ...state, flight_search_params: action.payload };
        case SET_TOKEN:
            return { ...state, random_token: action.payload };
        case SET_ORIGIN: 
            return { ...state, current_origin: action.payload };
        case SET_CAR_REQ_DATA: 
            return { ...state, car_reqdata: action.payload };
        case SET_CAR_SEARCH_DATA:
            return { ...state, carList: action.payload };
        case SET_SELECTED_CAR_DATA: 
            return { ...state, selectedCar: action.payload };
        case SET_HOTEL_SEARCH_DATA:
            return { ...state, hotelSearchList: action.payload };
        case SET_HOTEL_REQ_DATA: 
            return { ...state, hotelReqdata: action.payload };
        case GET_SELETED_HOTEL: 
            return { ...state, selectedHotel: action.payload };    
        default:
            return state;
    }
}