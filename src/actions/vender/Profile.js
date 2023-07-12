import axios from 'axios';
import { API } from '../../config/Config';
import { apiErrors } from '../../config/HandleAPIErrors';
import { SET_BROCHURES, SET_PORTFOLIO_FOLDER, SET_CERTIFICATIONS, SET_GALLERY } from '../Types';

require('dotenv').config();

/**
 * @method addRestaurantProfile
 * @description add restaurant profile detail
 */
export function addRestaurantProfile(data, callback) {
    const request = axios.post(`${API.saveRestaurantProfileDetail}`, data)
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
 * @method addRestaurantProfile
 * @description add restaurant profile detail
 */
export function updateRestaurantProfile(data, callback) {
    const request = axios.post(`${API.updateRestaurantProfileDetail}`, data)
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
 * @method getAllMenucategories
 * @description get all menu categories
 */
export function getAllMenucategories(id, callback) {
    const request = axios.get(`${API.getAllMenuCategory}/${id}`)
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
 * @method createMenu
 * @description create menu
 */
export function createMenu(data, callback) {
    const request = axios.post(`${API.getMenuItemById}`, data)
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
 * @method updateMenu
 * @description create menu
 */
 export function updateMenu(data, callback) {
    const request = axios.post(`${API.updateMenu}`, data)
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
export function AddMenuCategory(data, callback) {
    const request = axios.post(`${API.addMenuCategory}`, data)
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
 * @method updateMenuCategory
 * @description add menu category
 */
 export function updateMenuCategory(data, callback) {
    const request = axios.post(`${API.updateMenuCategory}`, data)
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
export function viewPortfolio() {
    const request = axios.get(`${API.viewPortfolio}`)
    return (dispatch) => {
        request.then((res) => {
            // callback(res)
            dispatch({
                type: SET_PORTFOLIO_FOLDER,
                payload: res
            })
        })
            .catch(function (error) {
                // callback(error)
                apiErrors(error)
            });
    }
}

/**
 * @method getPortfolioImages
 * @description get Portfolio Images by Id
 */
export function getPortfolioImages(reqData, callback) {
    const request = axios.get(`${API.viewPortfolio}/${reqData.id}?trader_user_id=${reqData.trader_user_id}`)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
            // dispatch({
            //     type: SET_PORTFOLIO_FOLDER,
            //     payload: res
            // })
        })
            .catch(function (error) {
                callback(error)
                apiErrors(error)
            });
    }
}

/**
 * @method getPortfolioImages
 * @description get Portfolio Images by Id
 */
 export function deletePortfolioImages(reqData, callback) {
    const request = axios.post(`${API.deletePortfolioImages}`, reqData)
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
export function viewBroucher() {
    const request = axios.get(`${API.viewBrocher}`)
    return (dispatch) => {
        request.then((res) => {
            console.log('res: broch ', res);
            dispatch({
                type: SET_BROCHURES,
                payload: res
            })
            // callback(res)
        })
            .catch(function (error) {
                // callback(error)
                apiErrors(error)
            });
    }
}

/**
 * @method AddMenuCategory
 * @description add menu category
 */
export function viewCertification() {
    const request = axios.get(`${API.viewCertificate}`)
    return (dispatch) => {
        request.then((res) => {
            dispatch({
                type: SET_CERTIFICATIONS,
                payload: res
            })
        })
            .catch(function (error) {
                // callback(error)
                apiErrors(error)
            });
    }
}

/**
 * @method AddMenuCategory
 * @description add menu category
 */
 export function viewGallery() {
    const request = axios.get(`${API.viewGallery}`)
    return (dispatch) => {
        request.then((res) => {
            dispatch({
                type: SET_GALLERY,
                payload: res
            })
        })
            .catch(function (error) {
                // callback(error)
                apiErrors(error)
            });
    }
}

/**
 * @method AddMenuCategory
 * @description add menu category
 */
export function uploadDocuments(reqData, callback) {
    const request = axios.post(`${API.uploadDocuments}`, reqData)
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
export function deleteDocuments(reqData, callback) {
    const request = axios.delete(`${API.deleteDocuments}/${reqData}`)
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
export function createPortfolio(reqData, callback) {
    const request = axios.post(`${API.createPortfolio}`, reqData)
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
export function updatePortfolio(reqData, callback) {
    const request = axios.post(`${API.updatePortfolio}`, reqData)
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
 * @method upload Portfolio
 * @description add menu category
 */
export function portfolioUpload(reqData, callback) {
    const request = axios.post(`${API.uploadPortfolio}`, reqData)
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
export function deletePortfolioFolder(reqData, callback) {
    const request = axios.delete(`${API.deletePortfolio}/${reqData}`)
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