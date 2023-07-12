import axios from "axios";
import { API } from "../../config/Config";
import { apiErrors } from "../../config/HandleAPIErrors";
import { GET_USER_PROFILE, GET_TRADER_PROFILE, CALL_LOADING } from "../Types";

require("dotenv").config();

/**
 * User get User profile
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getUserProfile(data, callback) {
  const request = axios.post(`${API.getUserProfile}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback !== undefined && callback(res);
        dispatch({
          type: GET_USER_PROFILE,
          payload: res.data,
        });
      })
      .catch(function (error) {
        callback !== undefined && callback(error);
        // apiErrors(error)
      });
  };
}

/**
 * User get User profile
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getTraderProfile(data, callback) {
  const request = axios.post(`${API.getTraderProfile}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("tradeProfile_res: ", res);
        callback !== undefined && callback(res);
        dispatch({
          type: GET_TRADER_PROFILE,
          payload: res,
        });
      })
      .catch(function (error) {
        callback !== undefined && callback(error);
        // apiErrors(error)
      });
  };
}

export function getTraderProfileUser(data,callback) {
  const request = axios.post(`${API.getTraderProfileUser}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("user_res: ", res);
        dispatch({
          type: GET_TRADER_PROFILE,
          payload: res,
        });
      })
      .catch(function (error) {
        callback !== undefined && callback(error);
        // apiErrors(error)
      });
  };
}
/**
 * @method getTraderProfileData
 * @description get user profile data
 */
export function getTraderProfileData(data, callback) {
  
  const request = axios.post(
    `${API.getTraderProfile}`,
    { user_id: data.id },
    {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Accept: "application/json",
        Authorization: `Bearer ${data.token}`,
      },
    }
  );
  return (dispatch) => {
    request
      .then((res) => {
        dispatch({
          type: GET_TRADER_PROFILE,
          payload: res,
        });
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ^ >>>", error);
      });
  };
}

/**
 * User save User profile
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function saveTraderProfile(data, callback) {
  const request = axios.post(`${API.saveTraderProfile}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: ", res);
        callback !== undefined && callback(res);
        // dispatch({
        //     type: GET_TRADER_PROFILE,
        //     payload: res
        // })
      })
      .catch(function (error) {
        callback !== undefined && callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User save User profile
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function checkPaypalAccepted(data, callback) {
  const request = axios.post(`${API.checkPaypalAccepted}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: ", res);
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User save User profile
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getPaypalUrl(data, callback) {
  const request = axios.post(`${API.getPaypalUrl}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: ", res);
        callback(res);
        // dispatch({
        //     type: GET_TRADER_PROFILE,
        //     payload: res
        // })
      })
      .catch(function (error) {
        callback !== undefined && callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User save User profile
 * @param data
 * @param callback
 * @returns {function(*)}
 */
 export function getStripeUrl(data, callback) {
  const request = axios.post(`${API.getStripeUrl}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: ", res);
        callback(res);
        // dispatch({
        //     type: GET_TRADER_PROFILE,
        //     payload: res
        // })
      })
      .catch(function (error) {
        callback !== undefined && callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User save User profile
 * @param data
 * @param callback
 * @returns {function(*)}
 */
 export function verifyStripe(data,callback) {
  const request = axios.get(`${API.verifyStripe}?ca_id=${data.ca_id}`);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: ", res);
        callback(res);
        // dispatch({
        //     type: GET_TRADER_PROFILE,
        //     payload: res
        // })
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User save User profile
 * @param data
 * @param callback
 * @returns {function(*)}
 */
 export function verifyPaypal(data,callback) {
  const request = axios.post(`${API.verifyPaypal}`,data.data);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: ", res);
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * Get Paypal Login Url
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getPaypalLoginUrl(callback) {
  const request = axios.get(`${API.getPaypalClassifiedsLoginUrl}`);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: ", res);
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        apiErrors(error);
      });
  };
}
/**
 * Get Paypal Login Url
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function sendPaypalCode(reqData, callback) {
  const request = axios.get(`${API.sendPaypalCode}?code=${reqData.code}&state=${reqData.state}`);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: ", res);
        callback(res);
      })
      .catch(function (error) {
        apiErrors(error);
        // callback(error);
      });
  };
}

/**
 * User change user name
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function changeUserName(data, callback) {
  const request = axios.post(`${API.changeUserName}`, data);
  return (dispatch) => {
    dispatch({ type: CALL_LOADING });
    request
      .then((res) => {
        dispatch({ type: CALL_LOADING });
        callback(res);
        getUserProfile({ user_id: data.user_id });
      })
      .catch(function (error) {
        dispatch({ type: CALL_LOADING });
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

/**
 * User change user changeMobNo
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function changeMobNo(data, callback) {
  const request = axios.post(`${API.changeMobNo}`, data);
  return (dispatch) => {
    dispatch({ type: CALL_LOADING });
    request
      .then((res) => {
        dispatch({ type: CALL_LOADING });
        getUserProfile({ user_id: data.user_id });
        callback(res);
      })
      .catch(function (error) {
        dispatch({ type: CALL_LOADING });
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

/**
 * User change user changeMobNo
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function changeEmail(data, callback) {
  const request = axios.post(`${API.changeEmail}`, data, {
    "Content-Type": "multipart/form-data",
  });
  return (dispatch) => {
    dispatch({ type: CALL_LOADING });
    request
      .then((res) => {
        dispatch({ type: CALL_LOADING });
        getUserProfile({ user_id: data.user_id });
        callback(res);
      })
      .catch(function (error) {
        dispatch({ type: CALL_LOADING });
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

/**
 * User change user changeMobNo
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function changeProfileImage(data, callback) {
  const request = axios.post(`${API.changeProfile}`, data);
  return (dispatch) => {
    dispatch({ type: CALL_LOADING });
    request
      .then((res) => {
        dispatch({ type: CALL_LOADING });
        callback(res.data);
      })
      .catch(function (error) {
        dispatch({ type: CALL_LOADING });
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}
/**
 * User change user company logo
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function changeCompanyLogo(data, callback) {
  const request = axios.post(`${API.updateUserProfile}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res.data);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

/**
 * User change user changeMobNo
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function changeAddress(data, callback) {
  const request = axios.post(`${API.changeAddress}`, data);
  return (dispatch) => {
    dispatch({ type: CALL_LOADING });
    request
      .then((res) => {
        dispatch({ type: CALL_LOADING });
        getUserProfile({ user_id: data.user_id });
        callback(res.data);
      })
      .catch(function (error) {
        dispatch({ type: CALL_LOADING });
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

export function getUserNotification(userId,isLimited ,callback) {
  var limit = '';
  if(isLimited == true){
    limit = '?limit=5';
  }
  const request = axios.get(`${API.userNotifications}/${userId}${limit}`);
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


export function deleteUserNotification(notificationId, callback) {
  const request = axios.delete(`${API.deleteUserNotifications}/${notificationId}`);
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

export function updateUserNotificationStatus(data, callback) {
  const request = axios.post(`${API.updateUserNotificationStatus}`, data);
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

export function getUserWishList(data, callback) {
  const request = axios.post(`${API.useWishList}`, data);
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

export const removeFoodScannerItemFromFavorite = (requestData, callback) => {
  const request = axios.post(`${API.addToFavoriteFoodProduct}`, requestData);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        apiErrors(error);
      });
  };
};

/**
 * User save its size guide
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function saveSizeGuide(data, callback) {
  const request = axios.post(`${API.addSizeGuide}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: ", res);
        callback !== undefined && callback(res);
        // dispatch({
        //     type: GET_TRADER_PROFILE,
        //     payload: res
        // })
      })
      .catch(function (error) {
        callback !== undefined && callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User delete its size guide
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function deleteSizeGuide(data, callback) {
  const request = axios.post(`${API.deleteSizeGuide}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res: ", res);
        callback !== undefined && callback(res);
      })
      .catch(function (error) {
        callback !== undefined && callback(error);
        apiErrors(error);
      });
  };
}

export function removeReview(data, callback) {
  const request = axios.post(`${API.removeReview}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        apiErrors(error);
      });
  };
};
