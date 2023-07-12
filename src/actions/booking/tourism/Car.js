import axios from 'axios';
import { API } from '../../../config/Config';
import { apiErrors } from '../../../config/HandleAPIErrors';
import { SET_SELECTED_CAR_DATA, SET_CAR_SEARCH_DATA, SET_CAR_REQ_DATA } from '../../Types'
import { toastr } from 'react-redux-toastr';
import { capitalizeFirstLetter } from '../../../components/common'

/**
 * @method getPopularDestinations
 * @descriptionhandle get flight which are most booked
 */
export function getPopularDestinations(callback) {
    const request = axios.post(`${API.getCarPopularDest}`)
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
 * @method carSearchAPI
 * @descriptionhandle car rental search api
 */
export function carSearchAPI(data, callback) {
    let { startDate, endDate, isSamePickAndDrop, pickupLocationLat, pickupLocationLng, dropoffLocationLat, dropoffLocationLng, userId, rentalCodes } = data
    const request = axios.get(`${API.getCarSearchData}?startDate=${startDate}&endDate=${endDate}&isSamePickAndDrop=${isSamePickAndDrop}&pickupLocationLat=${pickupLocationLat}&pickupLocationLng=${pickupLocationLng}&dropoffLocationLat=${dropoffLocationLat}&dropoffLocationLng=${dropoffLocationLng}&userId=${userId}&rentalCodes=${rentalCodes}`)
    return (dispatch) => {
        request.then((res) => {
            let err = res.data && res.data.err ? res.data.err : ''
            if (err && Array.isArray(err) && err.length) {
                let msg = err[0].errorWarningDescription && err[0].errorWarningDescription && err[0].errorWarningDescription.freeText ? err[0].errorWarningDescription.freeText : ""
                if (msg) {
                    toastr.warning(capitalizeFirstLetter(msg))
                }
                dispatch({
                    type: SET_CAR_SEARCH_DATA,
                    payload: ''
                })
            } else {
                dispatch({
                    type: SET_CAR_SEARCH_DATA,
                    payload: res.data
                })
            }
            callback(res);
        }).catch(function (error) {
            console.log('$$$$$error: ', error.response);
            dispatch({
                type: SET_CAR_SEARCH_DATA,
                payload: ''
            })
            apiErrors(error)
            callback(error);
        });
    }
}

/**
* @method setCarReqData
* @description set car request data
*/
export function setCarReqData(res) {
    return (dispatch) => {
        dispatch({
            type: SET_CAR_REQ_DATA,
            payload: res
        })
    }
}

/**
 * @method getTopRentalCompany
 * @descriptionhandle get top rental company
 */
export function getTopRentalCompany(callback) {
    const request = axios.get(`${API.topRentalcar}`)
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
 * @method checkIsCarFavOrNot
 * @descriptionhandle get top rental company
 */
export function checkIsCarFavOrNot(data, callback) {
    const request = axios.post(`${API.checkIsCarFav}`, { car_id: data.id, user_id: data.user_id })
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
 * @method markCarAsFav
 * @descriptionhandle get top rental company
 */
export function markCarAsFav(reqData, callback) {
    const request = axios.post(`${API.carMarkFav}`, reqData)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error.response);
        });
    }
}


/**
 * @method postCarReview
 * @descriptionhandle get top rental company
 */
export function postCarReview(reqData, callback) {
    const request = axios.post(`${API.postCarReview}`, reqData)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error.response);
        });
    }
}

/**
 * @method getCarViewCount
 * @descriptionhandle get top rental company
 */
export function getCarViewCount(id, callback) {
    const request = axios.post(`${API.getCarViews}`, { car_id: id })
    return (dispatch) => {
        request.then((res) => {
            console.log('res: **** ', res);
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error.response);
        });
    }
}

/**      
* @method setCarReqData
* @description set car request data
*/
export function setSelectedCarData(res) {
    return (dispatch) => {
        dispatch({
            type: SET_SELECTED_CAR_DATA,
            payload: res
        })
    }
}

/**
 * @method getCarAvailabilityRates
 * @descriptionhandle get car availability rates
 */
 export function getCarAvailabilityRates(data,callback) {
    const request = axios.post(`${API.getAvailabilityRates}`, data)
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
 * @method postCarDriverDetails
 * @descriptionhandle post car driver details
 */
 export function postCarDriverDetails(data,callback) {
    const request = axios.post(`${API.postDriverDetails}`, data)
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
 * @method carRecommendedForYou
 * @descriptionhandle cars recommended for you
 */
 export function carRecommendedForYou(data,callback) {
    const request = axios.post(`${API.carsrecommendedForYou}`, data)
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
 * @method addCarViews
 * @descriptionhandle cars recommended for you
 */
 export function addCarViews(reqData,callback) {
    const request = axios.post(`${API.addCarsView}`, reqData)
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
 * @method getCarRating
 * @descriptionhandle cars recommended for you
 */
 export function getCarRating(reqData,callback) {
    const request = axios.post(`${API.getCarReviews}`, reqData)
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
 * @method getCarRating
 * @descriptionhandle cars recommended for you
 */
 export function tourismCarBookingAPI(reqData,callback) {
    const request = axios.post(`${API.tourismCarBookingAPI}`, reqData)
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
 * @method getCarRating
 * @descriptionhandle cars recommended for you
 */
 export function tourismCarPaypalAPI(reqData,callback) {
    const request = axios.post(`${API.tourismCarPaypalAPI}`, reqData)
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