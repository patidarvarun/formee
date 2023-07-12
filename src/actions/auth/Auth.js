import axios from 'axios';
import { API } from '../../config/Config';
import { apiErrors } from '../../config/HandleAPIErrors';
import { SET_LOGGED_IN_USER, SEND_OTP, LOGOUT, GET_USER_PROFILE, CALL_LOADING, SET_SAVED_CATEGORIES } from '../Types';
import history from '../../common/History'
import { Router } from 'react-router-dom'
require('dotenv').config();

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json'
    }
};

export function sendOtp(reqData, callback) {
    const { phone, countryCode } = reqData
    const request = axios.post(`${API.sendOtp}`, { phone: `${countryCode}${phone}` })
    return (dispatch) => {
        request.then((res) => {
            callback(res)
        }).catch((err) => {
            console.log('err: ', err.response.data.msg);
            let errType = String(err.response.data.msg)
            if (errType === 'ERROR_INVALID_NUMBER') {
                err.response.data.msg = 'Your entered contact number is invalid.'
            } else if (errType === 'ERROR_WAIT_TO_RETRY') {
                err.response.data.msg = 'Please retry after some time.'
            } else if (errType === 'ERROR_MAX_ATTEMPTS_REACHED') {
                err.response.data.msg = 'You have reached to maximum attempts.'
            } else if (errType === 'ERROR_INVALID_PIN_CODE') {
                err.response.data.msg = 'Your entered otp does not matched.'
            } else if (errType === 'ERROR_TRANSACTION_LIMIT_EXCEEDED') {
                err.response.data.msg = 'You have reached to maximum attempts.'
            }
            apiErrors(err)
            callback(err)
        })
    }
}

export function verifyOtp(reqData, callback) {
    const { mobileNo, code } = reqData
    //const request = axios.post(`https://api.ringcaptcha.com/jele5e5uhi9i5ipiryqi/code/sms?phone=91${mobileNo}&api_key=4b0e05b17a0c5425bfab4f83ad79a80060a73ec7`)
    const request = axios.post(`${API.verifyOtp}`, { phone: `${mobileNo}`, code })
    return (dispatch) => {
        return request.then((res) => {
            callback(res)
        }).catch((err) => {
            let errType = String(err.response.data.msg)
            if (errType === 'ERROR_INVALID_NUMBER') {
                err.response.data.msg = 'Your entered contact number is invalid.'
            } else if (errType === 'ERROR_WAIT_TO_RETRY') {
                err.response.data.msg = 'Please retry after some time.'
            } else if (errType === 'ERROR_MAX_ATTEMPTS_REACHED') {
                err.response.data.msg = 'You have reached to maximum attempts.'
            } else if (errType === 'ERROR_INVALID_PIN_CODE') {
                err.response.data.msg = 'Your entered otp does not matched.'
            } else if (errType === 'ERROR_TRANSACTION_LIMIT_EXCEEDED') {
                err.response.data.msg = 'You have reached to maximum attempts.'
            }
            apiErrors(err)
            callback(err)
        })
    }
}

/**
 * User login action
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function login(data, callback) {
    const request = axios.post(`${API.login}`, data, axiosConfig)
    return (dispatch) => {
        // dispatch({ type: CALL_LOADING })
        request.then((res) => {
            // dispatch({ type: CALL_LOADING })
            callback(res);
            dispatch({
                type: SET_LOGGED_IN_USER,
                payload: res.data
            })
        }).catch(function (error) {
            // dispatch({ type: CALL_LOADING })
            console.log('error: ', error.response);
            apiErrors(error)
            callback(error);
        });
    }
}


/**
 * @method registerUserAPI
 * @description Register user by email
 */
export function registerUserAPI(requestData, callback) {
    return (dispatch) => {
        dispatch({ type: CALL_LOADING })
        axios.post(API.userRegistration, requestData)
            .then((response) => {
                dispatch({ type: CALL_LOADING })
                callback(response);
            })
            .catch((error) => {
                dispatch({ type: CALL_LOADING })
                apiErrors(error);
                callback(error);
            });
    };
}

/**
 * @method registerSocialUserAPI
 * @description Register user by email
 */
export function registerSocialUserAPI(requestData, callback) {
    return (dispatch) => {
        dispatch({ type: CALL_LOADING })
        axios.post(API.userRegistration, requestData, axiosConfig)
            .then((res) => {
                dispatch({ type: CALL_LOADING })
                callback(res);
                dispatch({
                    type: SET_LOGGED_IN_USER,
                    payload: res.data
                })
            })
            .catch((error) => {
                dispatch({ type: CALL_LOADING })
                console.log('error', error)
                apiErrors(error);
                callback(error);
            });
    };
}

/**
* @method ChangePasswordAPI
* @description change user password
*/
export function ChangePasswordAPI(requestData, callback) {
    const request = axios.post(`${API.changePassword}`, requestData, axiosConfig)
    return (dispatch) => {
        dispatch({ type: CALL_LOADING })
        request.then((res) => {
            dispatch({ type: CALL_LOADING })
            callback(res);
        }).catch(function (error) {
            dispatch({ type: CALL_LOADING })
            apiErrors(error)
            console.log('err', error)
            callback(error);
        });
    }
}

/**
 * User forgot password action
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function forgotPassword(data, callback) {
    const request = axios.post(`${API.forgotPassword}`, data, axiosConfig)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
            // dispatch({
            //     type: SET_LOGGED_IN_USER,
            //     payload: res.data
            // })
        }).catch(function (error) {
            // dispatch({ type: CALL_LOADING })
            console.log('error: ', error.response);
            apiErrors(error)
            callback(error);
        });
    }
}


/**
 * User reset password action
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function resetPassword(data, callback) {
    const request = axios.post(`${API.resetPassword}`, data, axiosConfig)
    return (dispatch) => {
        request.then((res) => {
            callback(res);

        }).catch(function (error) {
            apiErrors(error)
            callback(error);
        });
    }
}




/**
 * User login action
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function registerBussinessUserAPI(requestData, callback) {
    const headers = { 'Content-Type': 'multipart/form-data' }
    return (dispatch) => {
        dispatch({ type: CALL_LOADING })
        axios.post(API.vendorRegistration, requestData, headers)
            .then((response) => {
                dispatch({ type: CALL_LOADING })
                callback(response);
            })
            .catch((error) => {
                dispatch({ type: CALL_LOADING })
                console.log('error', error)
                apiErrors(error);
                callback(error);
            });
    };
}

/**
* @method logout
* @description logout 
*/
export function logout() {
    return (dispatch) => {
        // history.push('/')
        dispatch({
            type: LOGOUT,
        })
    }
}

// export function logout(callback) {
//     console.log('Hello: * ');

//     return (dispatch) => {
//         dispatch({ type: CALL_LOADING })
//         axios.post(API.logout)
//             .then((res) => {
//                 console.log('res:* ', res);
//                 dispatch({ type: CALL_LOADING })
//                 dispatch({ type: LOGOUT })
//                 callback()
//             })
//             .catch((error) => {
//                 dispatch({ type: CALL_LOADING })
//                 console.log('error *', error)
//                 apiErrors(error);
//             });
//     }
// }

/**
* @method getProfileData
* @description get user profile data 
*/
export function getProfileData(token, data, callback) {
    const request = axios.post(`${API.getUserProfile}`, data, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    return (dispatch) => {
        request.then((res) => {
            callback(res);
            dispatch({
                type: GET_USER_PROFILE,
                payload: res.data
            })
        })
            .catch(function (error) {
                console.log('error: ^', error);
                callback(error);
            });
    }
}

/**
* @method getOtherProfileData
* @description get user profile data 
*/
export function getOtherProfileData(data, callback) {
    const request = axios.post(`${API.getUserProfile}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        })
            .catch(function (error) {
                console.log('error: ^', error);
                callback(error);
            });
    }
}

/**
* @method getProfileData
* @description get user profile data 
*/
export function getUserMenuData(token) {
    const request = axios.get(`${API.userMenu}`, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    return (dispatch) => {
        request.then((res) => {
            dispatch({
                type: SET_SAVED_CATEGORIES,
                payload: res.data
            });
        }).catch(function (error) {
            apiErrors(error)
        });
    }
}





