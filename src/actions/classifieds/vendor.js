import axios from 'axios';
import { API } from '../../config/Config';
import { apiErrors } from '../../config/HandleAPIErrors';

/**
 * @method jobApplicationListAPI
 * @description get job apllication list
 */
 export function jobApplicationListAPI(data, callback) {
    const request = axios.post(`${API.jobApplicationList}`, data)
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
 * @method userJobApplicationListAPI
 * @description get job apllication list
 */
 export function userJobApplicationListAPI(data, callback) {
    const request = axios.post(`${API.userJobApplicationList}`, data)
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
 * @method deleteJobApplicationAPI
 * @description delete job application list
 */
 export function deleteJobApplicationAPI(data, callback) {
    const request = axios.post(`${API.jobApplicationDelete}`, data)
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
 * @method deleteMyOfferAPI
 * @description delete my offer item
 */
 export function deleteMyOfferAPI(data, callback) {
    const request = axios.post(`${API.deleteOfferListItem}`, data)
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
 * @method markAsSoldAPI
 * @description mark as sold api
 */
 export function markAsSoldAPI(data, callback) {
    const request = axios.post(`${API.markAsSold}`, data)
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


