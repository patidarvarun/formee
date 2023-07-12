import axios from 'axios';
import { API } from '../../../config/Config';
import { apiErrors } from '../../../config/HandleAPIErrors';
import {SET_ORIGIN,SET_TOKEN, SET_FLIGHT_SERACH_PARAMS, SET_MULTICITY_VALUE, SET_FLIGHT_RECORD } from '../../Types'

/**
 * @method getFlightAutocompleteList
 * @descriptionhandle get flight autocomplete list
 */
export function getFlightAutocompleteList(value, callback) {
    const request = axios.get(`${API.getFlightAutocompleteAPI}?location=${value}`)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}

/**
 * @method getMostBookedHotels
 * @descriptionhandle get flight autocomplete list
 */
 export function getMostBookedHotels(callback) {
    const request = axios.get(`${API.getMostBookedHotels}`)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}

/**
 * @method getFlightSearchRecords
 * @descriptionhandle get flight search records
 */
export function getFlightSearchRecords(data, callback) {
    const request = axios.post(`${API.getFlightSearch}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
            dispatch({
                type: SET_FLIGHT_RECORD,
                payload: res.data
            })
        }).catch(function (error) {
            console.log('error: ', error);
            apiErrors(error)
            callback(error);
        });
    }
}

/**
 * @method getMostBookedFlightList
 * @descriptionhandle get flight which are most booked
 */
export function getMostBookedFlightList(data, callback) {
    const request = axios.post(`${API.getMostBookedFilght}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}


/**
* @method getMostRecommendedTour
* @descriptionhandle get flight which are most recomended
*/
export function getMostRecommendedTour(data, callback) {
    const request = axios.post(`${API.getMostRecommendedTour}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
            apiErrors(error)
        });
    }
}

/**
* @method multiCityInitialValues
* @description setMulticityInitialValues
*/
export function multiCityInitialValues(res) {
    return (dispatch) => {
        dispatch({
            type: SET_MULTICITY_VALUE,
            payload: res
        })
    }
}


/**
* @method addMultiPassengerDetails
* @descriptionhandle get flight which are most recomended
*/
export function addMultiPassengerDetails(data, callback) {
    const request = axios.post(`${API.adPassengerDetails}`, data)
    return (dispatch) => {
        request.then((res) => {
            console.log('res: ', res);
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
            apiErrors(error)
        });
    }
}

/**
* @method setTourismSearchData
* @description set tourism sercah request data
*/
export function setTourismFlightSearchData(res) {
    return (dispatch) => {
        dispatch({
            type: SET_FLIGHT_SERACH_PARAMS,
            payload: res
        })
    }
}

/**
* @method checkFlightAvailable
* @descriptionhandle check flight available or not
*/
export function checkFlightAvailable(data, callback) {
    const request = axios.post(`${API.flightAirSell}`, data)
    return (dispatch) => {
        request.then((res) => {
            console.log('res: ', res);
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
            apiErrors(error)
        });
    }
}

/**
* @method getFlightPnrNumber
* @descriptionhandle check flight available or not
*/
export function getFlightPnrNumber(data, callback) {
    const request = axios.post(`${API.getPnrNumber}`, data)
    return (dispatch) => {
        request.then((res) => {
            console.log('res: ', res);
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
            apiErrors(error)
        });
    }
}

/**
* @method setFlightToken
* @description set flight token
*/
export function setFlightToken(res) {
    return (dispatch) => {
        dispatch({
            type: SET_TOKEN,
            payload: res
        })
    }
}

/**
* @method tourismFlightBookingAPI
* @descriptionhandle tourism flight booking api
*/
export function tourismFlightBookingAPI(data, callback) {
    const request = axios.post(`${API.tourismFlightBooking}`, data)
    return (dispatch) => {
        request.then((res) => {
            console.log('res: ', res);
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
            apiErrors(error)
        });
    }
}

/**
* @method tourismFlightBookingAPI
* @descriptionhandle tourism flight booking api
*/
export function tourismHotelBookingAPI(data, callback) {
    const request = axios.post(`${API.tourismHotelBooking}`, data)
    return (dispatch) => {
        request.then((res) => {
            console.log('res: ', res);
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
            apiErrors(error)
        });
    }
}

/**
* @method tourismFlightBookingAPI
* @descriptionhandle tourism flight booking api
*/
export function tourismHotelBookingPaypalAPI(data, callback) {
    const request = axios.post(`${API.tourismHotelPaypalBooking}`, data)
    return (dispatch) => {
        request.then((res) => {
            console.log('res: ', res);
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
            apiErrors(error)
        });
    }
}

/**
* @method tourismFlightBookingPaypal
* @descriptionhandle tourism flight booking api
*/
export function tourismFlightBookingPaypal(data, callback) {
    const request = axios.post(`${API.tourismFlightBookingPaypal}`, data)
    return (dispatch) => {
        request.then((res) => {
            console.log('res: ', res);
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
            apiErrors(error)
        });
    }
}
/**
* @method storeSearchDataAPI
* @descriptionhandle store search data
*/
export function storeSearchDataAPI(data) {
    const request = axios.post(`${API.storeSearchData}`, data)
    return (dispatch) => {
        request.then((res) => {
        }).catch(function (error) {
        });
    }
}


/**
* @method setCurrentOrigin
* @description set current origin
*/
export function setCurrentOrigin(res) {
    return (dispatch) => {
        dispatch({
            type: SET_ORIGIN,
            payload: res
        })
    }
}
