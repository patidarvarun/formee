import axios from 'axios';
import { API } from '../../config/Config';
import { apiErrors } from '../../config/HandleAPIErrors';
import { SET_ADDRESS_TYPE } from '../Types' 


/**
 * @method UserRetailOrderList
 * @description get retail category auto complete data
 */
export function UserRetailOrderList(data, callback) {
  
    
    const request = axios.post(`${API.userRetailOrder}`, data)
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
 * @method updateOrderStatusAPI
 * @descriptionupdate order status update
 */
export function updateOrderStatusAPI(data, callback) {
    const request = axios.post(`${API.updateRetailOrderStatus}`, data)
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
 * @method getAllTransactionList
 * @descriptionupdate get all transaction detail list
 */
export function getAllTransactionList(data, callback) {
    const request = axios.post(`${API.getTransactionDetail}`, data)
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
 * @method getSaveCartList
 * @descriptionupdate get saved cart list
 */
export function getSaveCartList(data,callback) {
    const request = axios.post(`${API.getSavedClassified}`, data)
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
 * @method retailRaiseDispute
 * @descriptionupdate get saved cart list
 */
export function retailRaiseDispute(data,callback) {
    const request = axios.post(`${API.customerRaiseDispute}`, data)
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
 * @method retailReplyDispute
 * @descriptionupdate get saved cart list
 */
export function retailReplyDispute(data,callback) {
    const request = axios.post(`${API.customerRetailDispute}`, data)
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
 * @method retailDailyDeals
 * @descriptionupdate retail daily deals
 */
export function retailDailyDeals(data,callback) {
    const request = axios.post(`${API.retailDailyDeals}`, data)
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
 * @method removeFromSaveForLaterAPI
 * @descriptionupdate remove from save for later list in retail cart
 */
 export function removeFromSaveForLaterAPI(data,callback) {
    const request = axios.post(`${API.removeFromSaveForLater}`, data)
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
 * @method changecartItemQuantityAPI
 * @descriptionupdate change retail retail cart item quantity
 */
 export function changecartItemQuantityAPI(data,callback) {
    const request = axios.post(`${API.changeCartItemQuantity}`, data)
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
 * @method deleteUserAddress
 * @descriptionupdate delete user address
 */
 export function deleteUserAddress(data,callback) {
    const request = axios.post(`${API.deleteUserAddress}`, data)
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
 * @method setDeliveryAddressType
 * @description set delivery address type
 */
 export function setDeliveryAddressType(res) {
    return (dispatch) => {
        dispatch({
            type: SET_ADDRESS_TYPE,
            payload: res
        })
    }
}









