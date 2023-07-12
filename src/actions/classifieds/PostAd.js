import axios from 'axios';
import { API } from '../../config/Config';
import { apiErrors } from '../../config/HandleAPIErrors';
import { STEP1, STEP2, STEP3, STEP4, CALL_LOADING,FILE_LIST, PREVIEW} from '../Types';


/**
 * @method getClassifiedDynamicInput
 * @description get all input for post an add
 */
export function getClassifiedDynamicInput(data, callback) {
    const request = axios.post(`${API.getClassifiedAttibute}`, data)
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
 * @method getChildInput
 * @description get chlild input
 */
export function getChildInput(data, callback) {
    const request = axios.post(`${API.childAttribute}`, data)
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
* @method setAdPostData
* @description set post an ad data
*/
export function setAdPostData(data, step) {
    if(step === 1){
        return (dispatch) => {
            dispatch({
                type: STEP1,
                payload: data
            })
        }
    }else if(step === 2){
        return (dispatch) => {
            dispatch({
                type: STEP2,
                payload: data
            })
        }
    }else if(step === 3){
        return (dispatch) => {
            dispatch({
                type: STEP3,
                payload: data
            })
        }
    }else if(step === 4){
        return (dispatch) => {
            dispatch({
                type: STEP4,
                payload: data
            })
        }
    }else if(step === 'fillist'){
        return (dispatch) => {
            dispatch({
                type: FILE_LIST,
                payload: data
            })
        }
    }else if(step === 'preview'){
        return (dispatch) => {
            dispatch({
                type: PREVIEW,
                payload: data
            })
        }
    }
}

/**
 * @method postAnAdd
 * @description post ad 
 */
export function postAnAd(data, callback) {
    const headers = { 'Content-Type': 'multipart/form-data' }
    const request = axios.post(`${API.postAd}`, data, headers)
    return (dispatch) => {
        // dispatch({ type: CALL_LOADING })
        request.then((res) => {
            // dispatch({ type: CALL_LOADING })
            callback(res);
        }).catch(function (error) {
            // dispatch({ type: CALL_LOADING })
            console.log('error: ', error.response);
            apiErrors(error)
            callback(error);
        });
    }
}

/**
 * @method getChildInput
 * @description get chlild input
 */
export function checkPermissionForPostAd(data,callback) {
    const request = axios.post(`${API.adPermission}`, data)
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
 * @method postAnAdd
 * @description post ad 
 */
export function bussinessUserPostAnAd(data, callback) {
    const headers = { 'Content-Type': 'multipart/form-data' }
    const request = axios.post(`${API.bussinessUserPostAd}`, data, headers)
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
 * @method getPostAdDetail
 * @description get post ad detail by id
 */
export function getPostAdDetail(data, callback) {
    const headers = { 'Content-Type': 'multipart/form-data' }
    const request = axios.post(`${API.getPostAnAdDetailAPI}`, data, headers)
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
 * @method updatePostAdAPI
 * @description get post ad detail by id
 */
export function updatePostAdAPI(data, callback) {
    // const headers = { 'Content-Type': 'multipart/form-data' }
    const request = axios.post(`${API.updatePostAd}`, data)
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
 * @method deleteInspectionAPI
 * @description delete inspection
 */
export function deleteInspectionAPI(data, callback) {
    const request = axios.post(`${API.deleteInspection}`, data)
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
 * @method getAttributeValues
 * @description get attribute values
 */
 export function getAttributeValues(data, callback) {
    const request = axios.post(`${API.getPriceValues}`, data)
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
 * @method getAttributeValues
 * @description get attribute values
 */
 export function deleteClassifiedImages(data, callback) {
    const request = axios.post(`${API.classified_delete_image}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}



