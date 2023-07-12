import axios from 'axios';
import { API } from '../config/Config';
import { apiErrors } from '../config/HandleAPIErrors';


/**
 * @method updateDefaultCard
 * @description update default card
 */
export function updateDefaultCard(data, callback) {
    const request = axios.post(`${API.updateDefaultCard}`, data)
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
 * @method deleteUserCard
 * @description delete user card
 */
export function deleteUserCard(data, callback) {
    const request = axios.delete(`${API.deleteUserCard}/${data.card_id}`)
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
 * @method getCardDetails
 * @description update default card
 */
export function getCardDetails(data, callback) {
    const request = axios.get(`${API.getCardDetails}/${data.card_id}`)
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
 * @method updateCardDetails
 * @description update default card
 */
export function updateCardDetails(data, callback) {
    const request = axios.post(`${API.updateCardDetails}`, data)
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
