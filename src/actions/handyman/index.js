import axios from 'axios';
import { API } from '../../config/Config';
import { apiErrors } from '../../config/HandleAPIErrors';

/**
 * @method getPreviousQuote
 * @description get previos quotes list
 */
export function getPreviousQuote(data, callback) {
    const request = axios.post(`${API.previousQuote}`, data)
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
 * @method createRequestQuote
 * @description create request quote
 */
export function createRequestQuote(data, callback) {
    const request = axios.post(`${API.requestQuoteCreate}`, data)
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
 * @method getTraderMonthBooking
 * @description get trader month booking
 */
export function getTraderMonthBooking(data, callback) {
    const request = axios.post(`${API.getTraderMonthBookingAPI}`, data)
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
 * @method getTraderBookingSlots
 * @description get trader booking slots
 */
export function getTraderBookingSlots(data, callback) {
    const request = axios.post(`${API.getTraderBookingSlots}`, data)
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
 * @method getTraderPreviousQuote
 * @description get trader previous quote
 */
export function getTraderPreviousQuote(data, callback) {
    const request = axios.post(`${API.getTraderQuote}`, data)
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
 * @method requestTraderBooking
 * @description request for booking 
 */
export function requestTraderBooking(data, callback) {
    const request = axios.post(`${API.createTraderBooking}`, data)
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
 * @method requestTraderBooking
 * @description request for booking 
 */
export function getTraderjobIdByQuoteId(data, callback) {
    const request = axios.post(`${API.getTraderjobIdByQuoteId}`, data)
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
 * @method cancelTraderQuoteStatus
 * @description request for Quote Status 
 */
export function cancelTraderQuoteStatus(data, callback) {
    const request = axios.post(`${API.cancelTraderQuoteStatus}`, data)
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
