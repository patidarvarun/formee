import axios from 'axios';
import { API } from '../../config/Config';
import { apiErrors } from '../../config/HandleAPIErrors';
import { GET_USER_PROFILE, CALL_LOADING, GET_SERVICE_AREA_OPTION } from '../Types';

require('dotenv').config();

/**
 * User get Enquiry List
 * @param data
 * @param callback
 * @returns {function(*)} 
 */
export function getEnquiryList(data, callback) {
    const request = axios.post(`${API.getHandyManVenderEnquiries}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
        })
            .catch(function (error) {
                callback(error)
                apiErrors(error)
            });
    }
}


/**
 * User get Job List
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getHandyManVenderJobs(data, callback) {
    const request = axios.post(`${API.getHandyManVenderJobs}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
        })
            .catch(function (error) {
                callback(error)
                apiErrors(error)
            });
    }
}

/**
 * User get Handyman History List
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getHandymanHistoryList(data, callback) {
    const request = axios.post(`${API.getHandyManVenderHistoryList}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
        })
            .catch(function (error) {
                callback(error)
                apiErrors(error)
            });
    }
}


/**
 * User get Enquiry Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getEnquiryDetails(data, callback) {
    const request = axios.post(`${API.getHandyManVenderEnquiryDetail}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
        })
            .catch(function (error) {
                callback(error)
                apiErrors(error)
            });
    }
}

/**
 * User get JobBooking Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getJobBookingDetails(data, callback) {
    const request = axios.post(`${API.getHandyManVenderBookingDetail}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
        })
            .catch(function (error) {
                callback(error)
                apiErrors(error)
            });
    }
}

/**
 * User get History Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getHistoryDetails(data, callback) {
    const request = axios.post(`${API.getHandyManVenderHistoryDetail}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
        })
            .catch(function (error) {
                callback(error)
                apiErrors(error)
            });
    }
}


/**
 * User decline Enquiry
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function declineEnquiry(data, callback) {
    const request = axios.post(`${API.changeEnquiryStatus}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
        })
            .catch(function (error) {
                callback(error)
                apiErrors(error)
            });
    }
}


/**
 * User change Handyman Booking Status
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function changeHandymanBookingStatus(userType, data, callback) {
    let apiRoute = API.changeHandymanBookingStatus
    if(userType == "wellbeing"){
        apiRoute = API.changeWellbeingBookingStatus
    }else if(userType == "beauty"){
        apiRoute = API.changeBeautyBookingStatus
    }
    const request = axios.post(`${apiRoute}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
        })
            .catch(function (error) {
                callback(error)
                apiErrors(error)
            });
    }
}

/**
 * User get History Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function createQuote(data, callback) {
    const request = axios.post(`${API.createQuote}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
        })
            .catch(function (error) {
                callback(error)
                apiErrors(error)
            });
    }
}

/**
 * User change Handyman Booking Status
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function rescheduleHanymanBooking(data, callback) {
    const request = axios.post(`${API.reScheduleHadymanBooking}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
        }).catch(function (error) {
            callback(error)
            apiErrors(error)
        });
    }
}

/**
 * raise Handyman dispute
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function raiseHandymanDispute(data, callback) {
    const request = axios.post(`${API.createHandymanVenderDispute}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
        })
            .catch(function (error) {
                callback(error)
                apiErrors(error)
            });
    }
}

/**
 * raise Handyman dispute
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function replyHandymanDispute(data, callback) {
    const request = axios.post(`${API.replyHandymanVenderDispute}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
        })
            .catch(function (error) {
                callback(error)
                apiErrors(error)
            });
    }
}


/**
 * raise Handyman dispute
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function submitHandymanReview(data, callback) {
    const request = axios.post(`${API.submitHandymanVenderReviews}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
        })
            .catch(function (error) {
                callback(error)
                apiErrors(error)
            });
    }
}

/**
 * @method AddMenuCategory
 * @description add menu category
 */
export function getServiceAreaOptions(callback) {
    const request = axios.get(`${API.getServiceOptions}`)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
        })
            .catch(function (error) {
                callback(error)
                apiErrors(error)
            });
        // request.then((res) => {
        //     dispatch({
        //       type: GET_SERVICE_AREA_OPTION,
        //       payload: res,
        //     });
        //   })
        //   .catch(function (error) {
        //     callback !== undefined && callback(error);
        //     // apiErrors(error)
        //   });
    }
}
