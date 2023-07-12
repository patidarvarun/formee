import axios from 'axios';
import { API } from '../../config/Config';
import { apiErrors } from '../../config/HandleAPIErrors';
import { SET_GENERAL_VENDOR_MY_OFFER, CALL_LOADING } from '../Types';

require('dotenv').config();

/**
 * User get Ad management Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getGeneralVendorMyOfferList(data, callback) {
    const request = axios.post(`${API.getGeneralVendorMyOffers}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res.data)
            dispatch({
                type: SET_GENERAL_VENDOR_MY_OFFER,
                payload: res.data
            })
        })
            .catch(function (error) {
                callback(error)
                // apiErrors(error)
            });
    }
}


/**
 * delete Classified
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function deleteGeneralClassified(data, callback) {
    const request = axios.post(`${API.deleteGeneralClassified}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res.data)
        })
            .catch(function (error) {
                callback(error)
                apiErrors(error)
            });
    }
}


/**
 * get Offer Detail List
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getOfferDetailList(data, callback) {
    const request = axios.post(`${API.getGeneralOfferDetail}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res.data)
        })
            .catch(function (error) {
                callback(error)
                apiErrors(error)
            });
    }
}

/**
 * Change Status
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function changeGeneralOfferStatus(data, callback) {
    const request = axios.post(`${API.acceptOffer}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res.data)
        })
            .catch(function (error) {
                callback(error)
                apiErrors(error)
            });
    }
}


/**
 * Change Status
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function changeGeneralClassifiedStatus(data, callback) {
    console.log('step 1 >');
    const request = axios.post(`${API.changeClassifiedGeneralStatus}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res.data)
        })
            .catch(function (error) {
                callback(error)
                apiErrors(error)
            });
    }
}