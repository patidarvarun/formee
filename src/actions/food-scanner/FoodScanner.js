import axios from 'axios';
import { reactLocalStorage } from 'reactjs-localstorage';
import { API } from '../../config/Config';
import { apiErrors } from '../../config/HandleAPIErrors';


/**
 * @method getProductAutocompleteList
 * @description get product list in Auto Complete
 */
export const getProductAutocompleteList = (requestData, callback) => {
    const request = axios.post(`${API.foodScannerProductAutocompleteList}${requestData}`)
    return (dispatch) => {
        request.then((res) => {
            callback(res.data);
        }).catch(function(error) {
            apiErrors(error);
        });
    }
}

export const getProductList = (requestData, callback) => {
    const request = axios.post(`${API.foodScannerProductList}`, requestData)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function(error) {
            apiErrors(error);
            callback(error);
        });
    }
}

export const addToFavoriteFoodScanner = (requestData, callback) => {
    const request = axios.post(`${API.addToFavoriteFoodProduct}`, requestData)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function(error) {
            apiErrors(error);
        });
    }
}

/**
 * @method foodProductList
 * @description get product list in Auto Complete
 */
export const foodProductList = (callback) => {
    const request = axios.post(`${API.foodProductList}`)
    return (dispatch) => {
        request.then((res) => {
            callback(res.data);
        }).catch(function(error) {
            apiErrors(error);
        });
    }
}

/**
 * @method addProduct
 * @description get product list in Auto Complete
 */
export const addProduct = (requestData, callback) => {
    const request = axios.post(`${API.addProduct}`, requestData)
    return (dispatch) => {
        request.then((res) => {
            callback(res.data);
        }).catch(function(error) {
            apiErrors(error);
        });
    }
}

/**
 * @method barcodeSearch
 * @description get product list in Auto Complete
 */
export const barcodeSearch = (searchKeyword, callback) => {
    const request = axios.post(`${API.barcodeSearch}${searchKeyword}`)
    return (dispatch) => {
        request.then((res) => {
            callback(res.data);
        }).catch(function(error) {
            apiErrors(error);
        });
    }
}

/**
 * @method searchInFoodScanner
 * @description get product list in Auto Complete
 */
export const searchInFoodScanner = (requestData, callback) => {
    const request = axios.post(`${API.foodScannerSearch}`, requestData)
    return (dispatch) => {
        request.then((res) => {
            callback(res.data);
        }).catch(function(error) {
            callback(error)
                // apiErrors(error);
        });
    }
}