import axios from 'axios';
import { API } from '../../config/Config';
import { apiErrors } from '../../config/HandleAPIErrors';
 
export function fitnessListCustomerClasses(data, callback) {
    const request = axios.post(`${API.listCustomerClasses}`, data)
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

export function getMyFitnessBookingCalenderList(data, callback) {
    const request = axios.post(`${API.getMyFitnessBookingCalender}`, data)
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

export function fitnessListCustomerHistoryClasses(data, callback) {
    const request = axios.get(`${API.listCustomerHistoryClasses}?order=${data.order}&search=${data.search}&page=${data.page}&page_size=${data.page_size}`)
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

export function rateTraderClass(data, callback) {
    const request = axios.post(`${API.rateTraderClass}`, data)
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

export function fitnessCustomerListAllSubscriptions(data, callback) {
    const request = axios.post(`${API.fitnessCustomerListAllSubscriptions}`, data)
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

export function showCustomerClass(data, callback) {
    const request = axios.post(`${API.showCustomerClass}`, data)
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