import axios from 'axios';
import { API } from '../../config/Config';
import { apiErrors } from '../../config/HandleAPIErrors';

require('dotenv').config();

/**
 * User get dashboard Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getDashBoardDetails(data, callback) {
    const request = axios.post(`${API.getEmployerDashboard}`, data)
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

