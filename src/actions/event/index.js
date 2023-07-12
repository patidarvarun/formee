import axios from "axios";
import { API } from "../../config/Config";
import { apiErrors } from "../../config/HandleAPIErrors";

export function checkEventTypeSubcategory(id, callback) {
  const request = axios.post(`${API.bookingSubCategory}?id=${id}`);
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

export function sendEventEnquiry(data, callback) {
  const headers = { "Content-Type": "multipart/form-data" };
  const request = axios.post(`${API.sendEventEnquiry}`, data, headers);
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
 * User get Enquiry List
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getCustomerCatererEnquiry(data, callback) {
  const request = axios.get(`${API.eventcatereCustomerEquiryList}`, {
    params: data,
  });
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

export function declineEnquiryByCustomer(data, callback) {
  const request = axios.post(`${API.declineEnquiryByCustomer}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        //   callback(error);
        apiErrors(error);
      });
  };
}

export function customerCancelQuoteRequest(data, callback) {
  const request = axios.post(`${API.customerCancelQuoteRequest}`, data);
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
export function getCustomerCatererBookings(data, callback) {
  const request = axios.get(`${API.eventcatererCustomerBookingList}`, {
    params: data,
  });
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
export function getCustomerCatererHistoryList(data, callback) {
  const request = axios.get(`${API.eventcatererCustomerHistoryList}`, {
    params: data,
  });
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
export function getCustomerCatererBookingDetail(data, callback) {
  const request = axios.get(
    `${API.eventcatereCustomerBookingsDetail}/${data.id}`
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

export function postBookingsDetail(data, callback) {
  console.log("bhcgngngnh", data);
  const request = axios.post(`${API.postBookingsDetail}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        //   callback(error);
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
export function getCustomerCatererEnquiryDetail(data, callback) {
  const request = axios.get(
    `${API.eventcatereCustomerEquiryDetail}/${data.id}`
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
 * User decline Enquiry
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function eventjobCheckoutSuccess(data, callback) {
  const request = axios.post(`${API.eventjobCheckoutSuccess}`, data);
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
export function declineCustomerEventEnquiry(data, callback) {
  const request = axios.post(`${API.declinCustomerEventEnquiry}`, data);
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
export function eventEnquiryCheckout(data, callback) {
  const request = axios.post(`${API.eventEnquiryCheckout}`, data);
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
export function eventCalendarBookings(data, callback) {
  const request = axios.post(`${API.eventCalendarBookings}`, data);
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
