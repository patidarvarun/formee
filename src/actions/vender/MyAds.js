import axios from 'axios';
import { API } from '../../config/Config';
import { apiErrors } from '../../config/HandleAPIErrors';
import { GET_USER_PROFILE, CALL_LOADING } from '../Types';

require('dotenv').config();

/**
 * User get Ad management Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getAdManagementDetails(data, callback) {
    const request = axios.post(`${API.getAdManagementDetails}`, data)
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
export function changeClassifiedStatus(data, callback) {
    const request = axios.post(`${API.changeClassifiedStatus}`, data)
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
export function changeApplicationStatus(data, callback) {
    const request = axios.post(`${API.changeApplicationStatus}`, data)
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
 * delete Classified
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function deleteClassified(data, callback) {
    const request = axios.post(`${API.deleteClassifiedAPI}`, data)
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
 * delete Classified
 * @param getVendorClassified
 * @param callback
 * @returns {function(*)}
 */
export function getVendorClassified(data, callback) {
    const request = axios.post(`${API.getVendorClassified}`, data)
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
 * delete Classified
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getCandidatesList(data, callback) {
    const request = axios.post(`${API.getJobApplications}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res.data)
        })
            .catch(function (error) {
                console.log('error: ', error);
                callback(error)
                // apiErrors(error)
            });
    }
}


/**
 * @method getVendorAdListAPI
 * @description get vendor ad records
 */
export function getVendorAdListAPI(data, callback) {
    const request = axios.post(`${API.vendorAdList}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
        })
        .catch(function (error) {
            callback(error)
            // apiErrors(error)
        });
    }
}

/**
 * @method getUserInspectionList
 * @description get user ad records
 */
export function getUserInspectionList(data, callback) {
    const request = axios.post(`${API.userInspectionList}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
        })
        .catch(function (error) {
            callback(error)
            // apiErrors(error)
        });
    }
}

/**
 * @method updateUserInspectionList
 * @description update user ad records
 */
export function updateUserInspectionList(data, callback) {
    const request = axios.post(`${API.userUpdateInspection}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
        })
        .catch(function (error) {
            callback(error)
            // apiErrors(error)
        });
    }
}

/**
 * @method getInspectionListAPI
 * @description get inspection list data
 */
export function getInspectionListAPI(data, callback) {
    const request = axios.post(`${API.getInspectionList}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
        })
        .catch(function (error) {
            callback(error)
            // apiErrors(error)
        });
    }
}

/**
 * @method deleteAllInspection
 * @description delete all inspection item
 */
export function deleteAllInspectionAPI(data, callback) {
    const request = axios.post(`${API.deleteAllInspection}`, data)
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
 * @method deleteInspectionAPI
 * @description delete inspection by id
 */
export function deleteInspectionAPI(data, callback) {
    const request = axios.post(`${API.deleteInspection}`, data)
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
 * Change Status
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getResumeDetail(data, callback) {
    const request = axios.post(`${API.getResumeFile}`, data)
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