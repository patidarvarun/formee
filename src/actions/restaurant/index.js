import axios from "axios";
import { API } from "../../config/Config";
import { apiErrors } from "../../config/HandleAPIErrors";

export function getUserRestaurantCurrentOrders(callback) {
  const request = axios.get(`${API.getUserRestaurantCurrentOrders}`);
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

export function getUserRestaurantPastOrders(callback) {
  const request = axios.get(`${API.getUserRestaurantPastOrders}`);
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

export function getUserRestaurantTrakingOrders(data,callback) {
  let { page,page_size} = data
  const request = axios.get(`${API.getTrakingOrders}/${null}?page=${page}&page_size=${page_size}`);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
        console.log(res, "ressssssss");
      })
      .catch(function (error) {
        apiErrors(error);
      });
  };
}
export function getUserRestaurantTrakingOrdersStatus(status, callback) {
  const request = axios.get(`${API.getTrakingOrders}/${status}`);
  return (dispatch) => {
    request
      .then((res) => {
        console.log(res, "res1234");
        callback(res);
        console.log(res, "ressssssss");
      })
      .catch(function (error) {
        apiErrors(error);
      });
  };
}

export function getOrderDetailsById(orderId, callback) {
  const request = axios.get(`${API.getOrderDetailsById}/${orderId}`);

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
export function addReviewService(data, callback) {
  const request = axios.post(`${API.postReviewService}`, data);

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

export function getCancelRestaurantOrder(data, callback) {
  const request = axios.post(`${API.getCancelRestaurantOrder}`, data);
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

export function getRestaurantVendorOrderByMonth(data, callback) {
  const request = axios.post(`${API.getRestaurantVendorOrderByMonth}`, data);
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

export function getRestaurantVendorEarning(data, callback) {
  const request = axios.post(`${API.getRestaurantVendorEarning}`, data);
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

export function getRestaurantOrdersForVendor(orderType, callback) {
  const request = axios.get(
    `${API.getRestaurantOrdersForVendor}/${orderType}/${null}`
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

export function getOrderDelete(id, callback) {
  console.log("ID", id);
  const request = axios.delete(`${API.getOrderDelete}/${id}`);
  console.log("REQUEST", request);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        // apiErrors(error)
        callback(error);
      });
  };
}

export function acceptRestaurantOrder(reqData, callback) {
  const request = axios.post(`${API.acceptRestaurantOrder}`, reqData);
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

export function updateRestaurantOrderStatus(reqData, callback) {
  const request = axios.post(`${API.updateRestaurantOrderStaus}`, reqData);
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

export function reOrderRestaurantItems(reqData, callback) {
  const request = axios.post(`${API.reOrderRestaurantItems}`, reqData);
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
