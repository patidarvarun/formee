import axios from "axios";
import { API } from "../../config/Config";
import { apiErrors } from "../../config/HandleAPIErrors";
import { GET_USER_PROFILE, GET_TRADER_PROFILE, CALL_LOADING } from "../Types";

require("dotenv").config();

/**
 * get custmor booking
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function listCustomerServiceBookings(data, callback) {
  const request = axios.post(`${API.listCustomerServiceBookings}`, data);
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
 * get  booking cards
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function listBookingSavedCards(callback) {
  const request = axios.get(`${API.listCustomerBookingsCard}`);
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
 * get custmor booking
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function listCustomerBookingsHistory(data, callback) {
  const request = axios.post(`${API.listCustomerBookingsHistory}`, data);
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

export function getCustomerMyBookingsCalender(data, callback) {
  const request = axios.post(`${API.getCustomerMyBookingsCalender}`, data);
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
 * get vendor booking spa
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function listVendorServiceSpaBookings(data, callback) {
  const request = axios.post(`${API.listVendorServiceSpaBookings}`, data);
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

export function listVendorServiceSpaBookingsHistory(data, callback) {
  const request = axios.post(
    `${API.listVendorServiceSpaBookingsHistory}`,
    data
  );
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

export function getVendorWellBeingMonthBookingsCalender(data, callback) {
  const request = axios.post(
    `${API.getVendorWellBeingMonthBookingsCalender}`,
    data
  );
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

export function vendorServiceBookingResponse(data, callback) {
  const request = axios.post(`${API.vendorServiceBookingResponse}`, data);
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

export function customerServiceBookingResponse(data, callback) {
  const request = axios.post(`${API.customerServiceBookingResponse}`, data);
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

export function deleteEventHistoryBooking(data, callback) {
  const request = axios.post(`${API.deleteEventHistoryBooking}`, data);
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

export function deleteBeautyHistoryBooking(data, callback) {
  const request = axios.post(`${API.deleteBeautyHistoryBooking}`, data);
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

export function deleteSpaHistoryBooking(data, callback) {
  const request = axios.post(`${API.deleteSpaHistoryBooking}`, data);
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

export function vendorChangeSlotStatus(data, callback) {
  const request = axios.post(`${API.vendorChangeSlotStatus}`, data);
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
export function customerBookingDispute(data, callback) {
  const request = axios.post(`${API.customerBookingDispute}`, data);
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

export function listVendorServiceFitnessBookingsHistory(data, callback) {
  const request = axios.post(
    `${API.listVendorServiceSpaBookingsHistory}`,
    data
  );
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
 * get vendor booking spa
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function listVendorServiceBeautyBookings(data, callback) {
  const request = axios.post(`${API.listVendorServiceBeautyBookings}`, data);
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

export function listCustomerBeautyServiceBookings(data, callback) {
  const request = axios.post(`${API.listUserBeautyServiceBookings}`, data);
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

export function listVendorServiceBeautyBookingHistory(data, callback) {
  const request = axios.post(
    `${API.listVendorServiceBeautyBookingHistory}`,
    data
  );
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

export function beautyServiceBookingsRating(data, callback) {
  const request = axios.post(`${API.beautyServiceBookingsReview}`, data);
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

export function wellbeingServiceBookingsRating(data, callback) {
  const request = axios.post(`${API.wellbeingServiceBookingsReview}`, data);
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

export function listCustomerBeautyServiceBookingsHistory(data, callback) {
  const request = axios.post(
    `${API.listUserBeautyServiceBookingsHistory}`,
    data
  );
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

export function cancelBeautyServiceBooking(data, callback) {
  const request = axios.post(`${API.cancelBeautyServiceBooking}`, data);
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

export function cancelFitnessServiceBooking(data, callback) {
  const request = axios.post(`${API.cancelFitnessServiceBooking}`, data);
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

export function customerBeautyBookingDispute(data, callback) {
  const request = axios.post(`${API.customerBeautyBookingDispute}`, data);
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

export function listCustomerHandymanQuote(data, callback) {
  const request = axios.post(`${API.listCustomerHandymanQuote}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: &&", res);
        callback(res);
      })
      .catch(function (error) {
        console.log("error: && ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function listCustomerHandymanEnquiryDetail(data, callback) {
  const request = axios.post(`${API.listCustomerHandymanEnquiryDetail}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: &&", res);
        callback(res);
      })
      .catch(function (error) {
        console.log("error: && ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function listCustomerHandymanBookings(data, callback) {
  const request = axios.post(`${API.listCustomerHandymanBookings}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: &&", res);
        callback(res);
      })
      .catch(function (error) {
        console.log("error: && ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function listCustomerHandymanBookingsDetail(data, callback) {
  const request = axios.post(`${API.listCustomerHandymanBookingsDetail}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: &&", res);
        callback(res);
      })
      .catch(function (error) {
        console.log("error: && ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function listCustomerHandymanHistory(data, callback) {
  const request = axios.post(`${API.listCustomerHandymanHistory}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: &&", res);
        callback(res);
      })
      .catch(function (error) {
        console.log("error: && ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function deleteHistoryBooking(data, callback) {
  const request = axios.post(`${API.deleteHistoryBooking}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: &&", res);
        callback(res);
      })
      .catch(function (error) {
        console.log("error: && ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function deleteCustomerHandymanHistoryBooking(data, callback) {
  const request = axios.post(
    `${API.deleteCustomerHandymanHistoryBooking}`,
    data
  );
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: &&", res);
        callback(res);
      })
      .catch(function (error) {
        console.log("error: && ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function listCustomerHandymanHistoryDetail(data, callback) {
  const request = axios.post(`${API.listCustomerHandymanHistoryDetail}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: &&", res);
        callback(res);
      })
      .catch(function (error) {
        console.log("error: && ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}
//

export function changeQuoteStatus(data, callback) {
  const request = axios.post(`${API.changeStatusQuoteRequest}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: &&", res);
        callback(res);
      })
      .catch(function (error) {
        console.log("error: && ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function changeJobStatus(data, callback) {
  const request = axios.post(`${API.changeStatusJobRequest}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: &&", res);
        callback(res);
      })
      .catch(function (error) {
        console.log("error: && ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function raiseCustomerHandymanDispute(data, callback) {
  const request = axios.post(`${API.raiseHandymanCustomerDispute}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: &&", res);
        callback(res);
      })
      .catch(function (error) {
        console.log("error: && ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function raiseCustomerHandymanDisputeReply(data, callback) {
  const request = axios.post(`${API.raiseHandymanCustomerDisputeReply}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: &&", res);
        callback(res);
      })
      .catch(function (error) {
        console.log("error: && ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function checkoutHandymanCustomerBooking(data, callback) {
  const request = axios.post(`${API.acceptHandymanCustomerBooking}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: &&", res);
        callback(res);
      })
      .catch(function (error) {
        console.log("error: && ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}
