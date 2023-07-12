import axios from "axios";
import { API } from "../../config/Config";
import { apiErrors } from "../../config/HandleAPIErrors";
import {
  SET_FITNESS_TYPES,
  SET_FOOD_TYPES,
  SET_RESTAURANT_DETAIL,
} from "./../Types";
import { setPriority } from "../../components/classified-templates/CommanMethod";

/**
 * @method getTraderMonthWellbeingBooking
 * @description get all new  time slot
 */
export function getTraderMonthWellbeingBooking(data, callback) {
  const request = axios.post(`${API.getTraderMonthWellbeingBooking}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

/**
 * @method getTraderMonthBeautyBooking
 * @description get all new  time slot
 */
export function getTraderMonthBeautyBooking(data, callback) {
  const request = axios.post(`${API.getTraderMonthBeautyBooking}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

/**
 * @method getSpaDietitianSpaBooking
 * @description get all new  time slot
 */
export function getSpaDietitianSpaBooking(data, callback) {
  const request = axios.post(`${API.getSpaDietitianSpaBooking}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

/**
 * @method getServiceBooking
 * @description get all new  time slot
 */
export function getServiceBooking(data, callback) {
  const request = axios.post(`${API.getServiceBooking}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function updateSpaDietitianSpaBooking(data, callback) {
  const request = axios.post(`${API.updateSpaDietitianSpaBooking}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function getTraderDetails(data, callback) {
  const request = axios.post(`${API.getTraderDetails}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}
export function getBookingIdByEnquiryId(enquiryId, callback) {
  const request = axios.post(`${API.getBookingIdByEnquiryId}`, enquiryId);
  return (dispatch) => {
    request
      .then((res) => {
        callback !== undefined && callback(res);
        dispatch({
          payload: res.data,
        });
      })
      .catch(function (error) {
        //console.log("error: ", error.response);
        apiErrors(error);
        callback !== undefined && callback(error);
      });
  };
}
export function getServiceBookingCheckout(data, callback) {
  const request = axios.post(`${API.getServiceBookingCheckout}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function spaDeletebookingHistory(data, callback) {
  const request = axios.post(`${API.spaDeletebookingHistory}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function getSpaServiceRepay(data, callback) {
  const request = axios.post(`${API.getSpaServiceRepay}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function checkoutTraderClassBooking(data, callback) {
  const request = axios.post(`${API.checkoutTraderClassBooking}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function getFitnessServiceBookingCheckout(data, callback) {
  const request = axios.post(`${API.getFitnessServiceBookingCheckout}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function getFitnessClassSchedule(data, callback) {
  const request = axios.post(`${API.getSchedule}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function buyClass(data, callback) {
  const request = axios.post(`${API.buyTraderClass}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function getFitnessHistoryListing(data, callback) {
  const request = axios.get(`${API.getFitnessCustomerHistoryList}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function getFitnessDeleteBooking(data, callback) {
  const request = axios.post(`${API.getFitnessDeleteBooking}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function getMyFitnessClassSchedule(callback) {
  const request = axios.get(`${API.getMySubscriptions}`);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}
