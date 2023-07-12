import axios from 'axios';
import { API } from '../../config/Config';
import { apiErrors } from '../../config/HandleAPIErrors';
import { SET_MY_BEST_PACKAGES, SET_ELIGIBLE_PACKAGES, SET_MY_PROMO, SET_MY_OFFERS, SET_ELIGIBLE_OFFERS, SET_ELIGIBLE_PROMO, SET_DEAL_FROM_ADMIN, SET_MY_DEALS } from '../Types';

require('dotenv').config();

/**
 * @method getBeautyServices
 * @description get all beauty services
 */
export function getBeautyServices(id, callback) {
    const request = axios.get(`${API.getBeautyService}/${id}`)
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
 * @method getSpaServices
 * @description get all spa services
 */
export function getSpaServices(id, callback) {
    const request = axios.get(`${API.getSpaService}/${id}`)
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
 * @method getSpaServices
 * @description get all spa services
 */
 export function getServiceCategory(id, callback) {
    const request = axios.get(`${API.getServiceCategory}`)
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
 *  delete service category
 */
export function deleteServiceCategory(data, callback) {
    const request = axios.post(`${API.deleteServiceCategory}`,data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
            getServiceCategory()
        })
            .catch(function (error) {
                callback(error)
                apiErrors(error)
            });
    }
}
// Delete Classes
export function deleteClass(data, callback) {
    const request = axios.post(`${API.deleteClass}`,data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
            getServiceCategory()
        })
            .catch(function (error) {
                callback(error)
                apiErrors(error)
            });
    }
}

/**
 * @method updateServiceCategory
 * @description update spa services
 */
 export function updateServiceCategory(data, callback) {
    const request = axios.post(`${API.updateServiceCategory}`, data)
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
 * @method removeServiceCategory
 * @description update spa services
 */
 export function removeServiceCategory(data, callback) {
    const request = axios.delete(`${API.removeServiceCategory}/${data}`)
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
 * @method bulkActionWellbeing
 * @description get restaurant details
 */
 export function bulkActionWellbeing(key, data, callback) {
    let apiroute = API.deleteAllServiceCategory;
    if (key === "1") {
            apiroute = API.activateAllServices;
        } else if (key === "2") {
            apiroute = API.deleteAllServices
        }
        const request = axios.post(`${apiroute}`, data)
        return (dispatch) => {
            request.then((res) => {
                callback(res);
            }).catch(function (error) {
                console.log('error: ', error.response);
                // apiErrors(error)
                callback(error);
            });
        }
    }

/**
 * @method removeService
 * @description update spa services
 */
 export function removeService(data, callback) {
    const request = axios.delete(`${API.createSpaService}/${data}`)
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
 * @method updateSpaServices
 * @description update spa services
 */
export function updateSpaServices(data, callback) {
    const request = axios.post(`${API.updateSpaService}`, data)
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
 * User get Ad management Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
 export function createServiceCategory(data, callback) {
    const request = axios.post(`${API.classCategory}`, data)
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
 * @method createSpaServices
 * @description create spa services
 */
export function createSpaServices(data, callback) {
    const request = axios.post(`${API.createSpaService}`, data)
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
 * @method getBeautyServices
 * @description get all beauty services
 */
export function deleteServices(id, callback) {
    const request = axios.delete(`${API.deleteBeautyService}/${id}`)
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
 * @method editServices
 * @description edit services
 */
export function editServices(data, callback) {
    const request = axios.post(`${API.deleteBeautyService}`, data)
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
 * @method getMenuItemsDetailById
 * @description get menu items detail by id
 */
export function getMenuItemsDetailById(id, callback) {
    const request = axios.get(`${API.getMenuItemById}/${id}/edit`)
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
 * @method deleteRestaurantMenu
 * @description delete restaurant menu item
 */
export function deleteRestaurantMenu(id, callback) {
    const request = axios.delete(`${API.deleteRestaurantItem}/${id}`)
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
 * @method updateRestaurantMenu
 * @description edit restaurant menu item
 */
export function updateRestaurantMenu(data, callback) {
    const request = axios.post(`${API.updateMenuItem}`, data)
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
 * @method updateRestaurantMenuCategory
 * @description edit restaurant menu category
 */
export function updateRestaurantMenuCategory(data, callback) {
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
 * @method activateRestaurantMenuCategory
 * @description edit restaurant menu category
 */
export function activateRestaurantMenuCategory(data, callback) {
    const request = axios.post(`${API.activateMenuCategory}`, data)
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
 * @method activateAndDeactivateRestaurant
 * @description activate deactivate restaurant
 */
export function activateAndDeactivateRestaurant(data, callback) {
    const request = axios.post(`${API.activeInactiveRestaurant}`, data)
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
 * @method activateAndDeactivateService
 * @description activate deactivate restaurant
 */
export function activateAndDeactivateService(data, callback) {
    const request = axios.post(`${API.activeDeactiveService}`, data)
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
 * @method getDealFromAdmin
 * @description get a deal from Admin
 */
export function getDealFromAdmin(data) {
    const request = axios.post(`${API.getDealFromAdmin}`, data)
    return (dispatch) => {
        request.then((res) => {
            // callback(res)
            dispatch({
                type: SET_DEAL_FROM_ADMIN,
                payload: res.data
            })
        })
            .catch(function (error) {
                // callback(error)
                apiErrors(error)
            });
    }
}

/**
 * @method getPackagesFromAdmin
 * @description get a deal from Admin
 */
export function getPackagesFromAdmin(data) {
    const request = axios.post(`${API.getEligiblePackages}`, data)
    return (dispatch) => {
        request.then((res) => {
            console.log('res: getPackagesFromAdmin ', res.data.data);
            // callback(res)
            dispatch({
                type: SET_ELIGIBLE_PACKAGES,
                payload: res.data
            })
        })
            .catch(function (error) {
                // callback(error)
                // apiErrors(error)
            });
    }
}

/**
 * @method createDeals
 * @description get a deal from Admin
 */
export function createDeals(data, callback) {
    const request = axios.post(`${API.createDeals}`, data)
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
 * @method changeDealStatus
 * @description change ststua of deal
 */
export function changeDealStatus(data, callback) {
    const request = axios.post(`${API.activateDeactivateDeal}`, data)
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
 * @method changeOfferStatus
 * @description change ststua of deal
 */
export function changeOfferStatus(data, callback) {
    const request = axios.post(`${API.activateDeactivateOffer}`, data)
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
 * @method changePromoStatus
 * @description change status of promo
 */
export function changePromoStatus(data, callback) {
    const request = axios.post(`${API.activateDeactivatePromo}`, data)
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
 * @method changePackageStatus
 * @description change status of promo
 */
export function changePackageStatus(data, callback) {
    const request = axios.post(`${API.activateDeactivatePacakage}`, data)
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
 * @method createBestPackage
 * @description craete a deal from vender
 */
export function createBestPackage(data, callback) {
    const request = axios.post(`${API.createBestPackage}`, data)
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
 * @method getMyDeals
 * @description get a deal from Admin
 */
export function getMyDeals(data) {
    const request = axios.post(`${API.myDeals}`, data)
    return (dispatch) => {
        request.then((res) => {
            // callback(res)
            dispatch({
                type: SET_MY_DEALS,
                payload: res.data
            })
        })
            .catch(function (error) {
                console.log('error: ', error);
                // callback(error)
                // apiErrors(error)
            });
    }
}

/**
 * @method getMyBestPackage
 * @description get a deal from Admin
 */
export function getMyBestPackage(data) {
    const request = axios.post(`${API.myBestPackages}`, data)
    return (dispatch) => {
        request.then((res) => {
            // callback(res)
            dispatch({
                type: SET_MY_BEST_PACKAGES,
                payload: res.data
            })
        })
            .catch(function (error) {
                console.log('error: ', error);
                // callback(error)
                // apiErrors(error)
            });
    }
}

/**
 * @method getMyPromotions
 * @description get a deal from Admin
 */
export function getMyPromotions(data) {
    const request = axios.post(`${API.myPromos}`, data)
    return (dispatch) => {
        request.then((res) => {
            // callback(res)
            dispatch({
                type: SET_MY_PROMO,
                payload: res.data
            })
        })
            .catch(function (error) {
                console.log('error: ', error);
                // callback(error)
                // apiErrors(error)
            });
    }
}

/**
 * @method getMyOffers
 * @description get a deal from Admin
 */
export function getMyOffers(data) {
    const request = axios.post(`${API.myOffers}`, data)
    return (dispatch) => {
        request.then((res) => {
            console.log('res: SET_MY_OFFERS ', res);
            // callback(res)
            dispatch({
                type: SET_MY_OFFERS,
                payload: res.data
            })
        })
            .catch(function (error) {
                console.log('error: ', error);
                // callback(error)
                // apiErrors(error)
            });
    }
}

/**
 * @method getEligiblePromotion
 * @description get a promo from Admin
 */
export function getEligiblePromotion(data) {
    const request = axios.post(`${API.eligiblePromo}`, data)
    return (dispatch) => {
        request.then((res) => {
            dispatch({
                type: SET_ELIGIBLE_PROMO,
                payload: res.data
            })
        })
            .catch(function (error) {
                // apiErrors(error)
            });
    }
}

/**
 * @method getEligibleOffer
 * @description get a promo from Admin
 */
export function getEligibleOffer(data) {
    const request = axios.post(`${API.eligibleOffer}`, data)
    return (dispatch) => {
        request.then((res) => {
            dispatch({
                type: SET_ELIGIBLE_OFFERS,
                payload: res.data
            })
        })
            .catch(function (error) {
                // apiErrors(error)
            });
    }
}

/**
 * @method createPromo
 * @description create a deal from vendor
 */
export function createPromo(data, callback) {
    const request = axios.post(`${API.addPromo}`, data)
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
 * @method createSpecialOffer
 * @description create a offer from vendor
 */
export function createSpecialOffer(data, callback) {
    const request = axios.post(`${API.addOffer}`, data)
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

