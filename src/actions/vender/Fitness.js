import axios from "axios";
import { API } from "../../config/Config";
import { apiErrors } from "../../config/HandleAPIErrors";

require("dotenv").config();

/**
 * User get Ad management Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function createFitnessClass(data, callback) {
  console.log("Create Fitness Called", data);
  const request = axios.post(`${API.createFitnessClass}`, data);
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
export function editMembership(data, callback) {
  console.log("Create Fitness Called", data);
  const request = axios.post(`${API.createMembership}`, data);
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
 * User get Ad management Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function createMemberShipPlan(data, callback) {
  console.log("Membership Plan Called", data);
  const request = axios.post(`${API.createMembership}`, data);
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
 * User get Ad management Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function createClassCategory(data, callback) {
  const request = axios.post(`${API.classCategory}`, data);  
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
 * User get Ad management Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getFitnessClassListing(data, callback) {
  const request = axios.get(`${API.getFitnessClasses}/${data.id}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res.data);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User get Ad management Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getFitnessMemberShipListing(data, callback) {
  const request = axios.post(`${API.getFitnessmembership}`, data);
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
 * User get Ad management Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getFitnessMemberShipBookings(data, callback) {
  const request = axios.post(`${API.getFitnessMembershipBookings}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res.data);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User get Ad management Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function changeStatusFitnessClass(data, callback) {
  console.log("Change Class Called");
  const request = axios.post(`${API.changeFitnessClassStatus}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res.data);
      })
      .catch(function (error) {
        apiErrors(error);
      });
  };
}
export function changeStatusMemberShip(data, callback) {
  console.log("Change Class Called");
  const request = axios.post(`${API.changeFitnessMemberShipStatus}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res.data);
      })
      .catch(function (error) {
        apiErrors(error);
      });
  };
}
/**
 * User get Ad management Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
// export function changeStatusMemberShip(data, callback) {
//   const request = axios.post(`${API.changeFitnessMemberShipStatus}`, data);
//   return (dispatch) => {
//     request
//       .then((res) => {
//         callback(res);
//       })
//       .catch(function (error) {
//         callback(error);
//         apiErrors(error);
//       });
//   };
// }

/**
 * User get Ad management Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
// export function deleteFitnessClass(data, callback) {
//   const request = axios.post(`${API.deleteFitnessClass}`, data);
//   return (dispatch) => {
//     request
//       .then((res) => {
//         callback(res);
//       })
//       .catch(function (error) {
//         callback(error);
//         apiErrors(error);
//       });
//   };
// }
// export function deleteFitnessClass(data) {
//   const request = axios.post(`${API.deleteFitnessClass}/${data}`);
//   console.log("DELETE DAta", request);
// }
export function deleteFitnessClass(data) {
  const request = axios.delete(`${API.deleteFitnessClass}/${data}`);
  if (request) {
    console.log("Deleted Successfully");
  }
}

/**
 * User get Ad management Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function deleteFitnessMemberShip(data, callback) {
  const request = axios.delete(
    `${API.deleteFitnessMembership}/${data.id}`,
    data
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
 * User remove fitness class time
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function removeFitnessClassTime(data, callback) {
  const request = axios.post(`${API.deleteClassSchedule}`, data);
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
 * User get Ad management Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function changeStatusOfAllFitnessClass(data, callback) {
  const request = axios.post(`${API.deActiveAllFitnessClass}`, data);
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
 * User get Ad management Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function changeStatusOfAllFitnessMembership(data, callback) {
  const request = axios.post(`${API.deActiveAllFitnessMembership}`, data);
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
 * User get Ad management Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getFitnessScheduleBookings(data, callback) {
  const request = axios.post(`${API.getFitnessSchedulesMyBookings}`, data);
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
 * User add fitness class subscription
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function addFitnessClassSubscription(data, callback) {
  const request = axios.post(`${API.addFitnessClassSubscription}`, data);
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
 * User get Ad management Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getFitnessBookingsHistory(data, callback) {
  const request = axios.post(`${API.fitnessVendorHistoryListing}`, data);
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
export function listTraderCustomersOfBookedClasses(data, callback) {
  const request = axios.post(`${API.listTraderCustomersOfBookedClasses}`, data);
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

export function vendorProfileFitnessDashboard(data, callback) {
  const request = axios.post(`${API.vendorprofileFitnessDashboard}`, data);
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

export function getTraderMonthFitnessBooking(data, callback) {
  const request = axios.post(`${API.getTraderMonthFitnessBooking}`, data);
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
