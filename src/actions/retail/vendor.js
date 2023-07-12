import axios from 'axios';
import { API } from '../../config/Config';
import { apiErrors } from '../../config/HandleAPIErrors';
import { SET_ADDRESS_TYPE } from '../Types' 


/**
 * @method sellerFeedbackListAPI
 * @description seller feedback list api
 */
export function sellerFeedbackListAPI(data, callback) {
    const request = axios.post(`${API.sellerFeedbackList}`, data)
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
 * @method sellerFeedbackListAPI
 * @description seller feedback list api
 */
 export function replyFeedbackAPI(data, callback) {
    const request = axios.post(`${API.replyFeedback}`, data)
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
 * @method retailAdManagementAPI
 * @description get admanagement list of retail vendor
 */
 export function retailAdManagementAPI(data, callback) {
    const request = axios.post(`${API.retailAdmanagement}`, data)
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
 * @method deleteRetailAdsAPI
 * @description delete retail ads api
 */
 export function deleteRetailAdsAPI(data, callback) {
    const request = axios.post(`${API.deleteRetailAds}`, data)
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
 * @method changeRetailStatusAPI
 * @description change retail ads status
 */
 export function changeRetailStatusAPI(data, callback) {
    const request = axios.post(`${API.changeRetailStatus}`, data)
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
 * @method deleteUploadedImagesOfPostAD
 * @description delete post ad uploaded images
 */
 export function deleteUploadedImagesOfPostAD(data, callback) {
    const request = axios.post(`${API.deletePostAnAdUploadedImages}`, data)
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
 * @method deleteUploadedImagesOfPostAD
 * @description delete post ad uploaded images
 */
 export function deleteClassifiedOfferReceivedAPI(data, callback) {
    const request = axios.post(`${API.deleteclassifiedofferreceived}`, data)
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


