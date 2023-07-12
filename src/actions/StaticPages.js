import axios from 'axios';
import { API } from '../config/Config';
import { apiErrors } from '../config/HandleAPIErrors';


/**
 * @method getAllStaticPages
 * @description get product list in Auto Complete
 */
export const getAllStaticPages = (requestData, callback) => {
    const request = axios.post(`${API.static}`, requestData )
    return (dispatch) => {
        request.then((res) => {
            callback(res.data);
        }).catch(function (error) {
            apiErrors(error);
        });
    }
}

/**
 * @method getFaqPage
 * @description get product list in Auto Complete
 */
export const getFaqPage = (callback) => {
    const request = axios.get(`${API.faqPage}`)
    return (dispatch) => {
        request.then((res) => {
            callback(res.data);
        }).catch(function (error) {
            apiErrors(error);
        });
    }
}