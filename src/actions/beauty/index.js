import axios from 'axios';
import { API } from '../../config/Config';
import { apiErrors } from '../../config/HandleAPIErrors';

/**
 * @method getBeautyServiceBooking
 * @description get all new  time slot
 */
export function beautyServiceBooking(data, callback) {
    const request = axios.post(`${API.beautyServiceBooking}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            apiErrors(error)
            callback(error);
        });
    }
}

/**
 * @method updateBeautyServiceBooking
 * @description get all new  time slot
 */
export function updateBeautyServiceBooking(data, callback) {
    const request = axios.post(`${API.updateBeautyServiceBooking}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            apiErrors(error)
            callback(error);
        });
    }
}

/**
 * @method updateBeautyServiceBookingFitness
 * @description get all new  time slot
 */
export function updateBeautyServiceBookingFitness(data, callback) {
    const request = axios.post(`${API.updateBeautyServiceBookingFitness}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            apiErrors(error)
            callback(error);
        });
    }
}

/**
 * @method getBeautyServiceBooking
 * @description get details of booking by service id
 */
export function getBeautyServiceBooking(data, callback) {
    const request = axios.post(`${API.getBeautyServiceBooking}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            apiErrors(error)
            callback(error);
        });
    }
}

/**
 * @method beautyServiceBookingCheckout
 * @description complete beauty service booking 
 */

export function beautyServiceBookingCheckout(data, callback) {
    const request = axios.post(`${API.beautyServiceBookingCheckout}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            apiErrors(error)
            callback(error);
        });
    }
}

export function beautyServiceBookingRepay(data, callback) {
    const request = axios.post(`${API.beautyServiceBookingRepay}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            apiErrors(error)
            callback(error);
        });
    }
}

export function beautyDeletebookingHistory(data, callback) {
    const request = axios.post(`${API.beautyDeletebookingHistory}`, data);
    return (dispatch) => {
        request
            .then((res) => {
                callback(res);
            })
            .catch(function (error) {
                console.log("error: ", error.response);
                apiErrors(error);
                callback(error);
            });
    };
}



