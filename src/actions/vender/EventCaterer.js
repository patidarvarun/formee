import axios from "axios";
import { API } from "../../config/Config";
import { apiErrors } from "../../config/HandleAPIErrors";
import { GET_USER_PROFILE, CALL_LOADING } from "../Types";

require("dotenv").config();

/**
 * User get Enquiry List
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getCatererEnquiry(data, callback) {
  const request = axios.get(`${API.eventcatereVenderEquiryList}`);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User get Booking List
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getCatererBookings(callback) {
  const request = axios.get(`${API.eventcatererVenderBookingList}`);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User get Cterer History List
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getCatererHistoryList(data, callback) {
  const request = axios.get(`${API.eventcatererVenderHistoryList}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User get Booking Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getCatererBookingDetail(data, callback) {
  const request = axios.get(
    `${API.eventcatereVenderBookingsDetail}/${data.id}`
  );
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User get Enquiryt Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getCatererEnquiryDetail(data, callback) {
  const request = axios.get(`${API.eventcatereVenderEquiryDetail}/${data.id}`);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User decline Enquiry
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function declineEventEnquiry(data, callback) {
  const request = axios.post(`${API.declinEventEnquiry}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}
export function DeleteTraderJobss(data, callback) {
  const request = axios.post(`${API.deleteTraderJobUrlss}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User decline Enquiry
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function DeleteTraderJobapi(data, callback) {
  const request = axios.post(`${API.deleteTraderJobUrl}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

export function deleteTraderEnquiryUrl(data, callback) {
  const request = axios.post(`${API.deleteTraderEnquiryUrl}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User decline Enquiry
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function DeleteWellBeingApi(data, callback) {
  const request = axios.post(`${API.DeleteWellBeingUrl}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User change Handyman Booking Status
 * @param data
 * @param callback
 * @returns {function(*)}
 */
 export function rescheduleEventBooking(data, callback) {
  const request = axios.post(`${API.rescheduleEventBookingapi}`, data)
  return (dispatch) => {
      request.then((res) => {
          callback(res)
      }).catch(function (error) {
          callback(error)
          apiErrors(error)
      });
  }
}

/**
 * User decline Enquiry
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function DeleteEventBookingapi(data, callback) {
  const request = axios.post(`${API.deleteEventBookingUrl}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User decline Enquiry
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function deleteEventEnquiry(data, callback) {
  const request = axios.post(`${API.deleteEventEnquiry}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User decline Enquiry
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function catererJobDone(data, callback) {
  const request = axios.post(`${API.sendEventBookingResponce}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User change Handyman Booking Status
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function changeEventBookingStatus(data, callback) {
  const request = axios.post(`${API.changeEventStatus}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * raise Caterer dispute
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function raiseCatererDispute(data, callback) {
  const request = axios.post(`${API.createCatererVenderDispute}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * raise Caterer dispute
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function replyCatererDispute(data, callback) {
  const request = axios.post(`${API.replyCatererVenderDispute}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * raise Caterer dispute
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function submitCatererReview(data, callback) {
  const request = axios.post(`${API.submitCatererVenderReviews}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

export function getTraderMonthEventBooking(data, callback) {
  const request = axios.post(`${API.getTraderMonthEventBooking}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * Event Calendar Bookings
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function eventVenderCalendarBookings(data, callback) {
  const request = axios.post(`${API.eventVenderCalendarBookings}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}
