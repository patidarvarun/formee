import axios from 'axios';
import { API } from '../../../config/Config';
import { apiErrors } from '../../../config/HandleAPIErrors';
import { SET_HOTEL_SEARCH_DATA, SET_HOTEL_REQ_DATA,GET_SELETED_HOTEL } from '../../Types'


/**
 * @method getTopRatedHotels
 * @descriptionhandle get top rated hotels
 */
export function getTopRatedHotels(data,callback) {
    const request = axios.post(`${API.getTopRatedhotel}`, data)
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
 * @method markFavUnFavHotels
 * @descriptionhandle mark favorite unfavorite hotels
 */
 export function markFavUnFavHotels(data,callback) {
    const request = axios.post(`${API.favoriteUnfavoriteHotel}`, data)
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
 * @method checkFavorite
 * @descriptionhandle check hotel is favorite or not
 */
 export function checkFavorite(data,callback) {
    const request = axios.post(`${API.isHotelFavorite}`, data)
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
 * @method hotelSearchAPI
 * @descriptionhandle hotel search api
 */
 export function hotelSearchAPI(data,callback) {
    const request = axios.post(`${API.hotelSearch}`, data)
    return (dispatch) => {
        request.then((res) => {
            if(res.status === 200){
                dispatch({
                    type: SET_HOTEL_SEARCH_DATA,
                    payload: res.data
                })
            }else {
                dispatch({
                    type: SET_HOTEL_SEARCH_DATA,
                    payload: ''
                })
            }
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            dispatch({
                type: SET_HOTEL_SEARCH_DATA,
                payload: ''
            })
            callback(error);
            apiErrors(error)
        });
    }
}

/**
* @method setHotelReqData
* @description set hotel reqdata
*/
export function setHotelReqData(res) {
    return (dispatch) => {
        dispatch({
            type: SET_HOTEL_REQ_DATA,
            payload: res
        })
    }
}

/**
* @method setSelectedHotelDetails
* @description set selected hotels details
*/
export function setSelectedHotelDetails(res) {
    return (dispatch) => {
        dispatch({
            type: GET_SELETED_HOTEL,
            payload: res
        })
    }
}

/**
 * @method getHotelTotalViews
 * @descriptionhandle get hotel total views
 */
 export function getHotelTotalViews(data,callback) {
    const request = axios.post(`${API.getHotelviews}`, data)
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
 * @method markFavUnFavHotels
 * @descriptionhandle mark favorite unfavorite hotels
 */
 export function getHotelAverageRating(data,callback) {
    const request = axios.post(`${API.getHotelavgrating}`, data)
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
 * @method addHotelreview
 * @descriptionhandle add hotel reviews
 */
 export function addHotelreview(data,callback) {
    const request = axios.post(`${API.postHotelReview}`, data)
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
 * @method addHotelViews
 * @descriptionhandle add hotel views
 */
 export function addHotelViews(data,callback) {
    const request = axios.post(`${API.addHotelViews}`, data)
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
 * @method getHotelDescriptiveInfo
 * @descriptionhandle get hotel descriptive information
 */
 export function getHotelDescriptiveInfo(data,callback) {
    const request = axios.post(`${API.getHotelDetails}`, data)
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
 * @method hotelMonoSearch
 * @descriptionhandle get hotel descriptive information
 */
 export function hotelMonoSearch(data,callback) {
    const request = axios.post(`${API.hotelMonoSearch}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}
