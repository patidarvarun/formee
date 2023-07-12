import { toastr } from 'react-redux-toastr';
import { MESSAGES } from './Message';
import { STATUS_CODES } from './StatusCode'
import { langs } from '../config/localization';
import { clearLocalStorage } from '../common/Methods'

/**
 * @method apiErrors
 * @description handle api error 
 */
export const apiErrors = (res, dispatch) => {
    const response = res ? res.response : undefined;

    // Adding un authorize condition after disscussion with kk
    if (response && response.data && response.status === STATUS_CODES.UNAUTHORIZED && response.data.error) {
        toastr.error(langs.error, langs.authentication_failed);
        clearLocalStorage()
    } else if (response && response.data && response.data.errors) {
        response.data && response.data.errors && Object.values(response.data.errors).map(el => {
            toastr.error(langs.error, el[0]);
        })
    } else if (response && response.data && response.data.error) {
        toastr.error(langs.error, response.data.error.message);
    } else if (response && response.data && Array.isArray(response.data.email)) {
        response.data.email.length && toastr.error(langs.error, response.data.email[0]);
    } else if (response && response.data && response.data.message) {
        toastr.error(langs.error, response.data.message);
    } else if (response && response.data && response.status === 415) {
        toastr.warning(response.data.msg);
    } else if (response && response.data && response.status === 422) {
        if(response.data.msg){
            toastr.error(langs.error, response.data.msg);
        }else{
            toastr.error(langs.error, response.data.message);
        }
    } else if (response && response.data && response.status === STATUS_CODES.PRECONDITION_FAILED) {
        toastr.error(langs.error, response.data.msg);
    } else if (response && response.data && response.status === STATUS_CODES.UNAUTHORIZED) {
        toastr.error(langs.error, response.data.error);
    } else {
        toastr.error(langs.error, MESSAGES.SERVER_ERROR);
    }
}