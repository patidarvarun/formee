import axios from "axios";
import { API } from "../config/Config";
import { apiErrors } from "../config/HandleAPIErrors";

/**
 * @method getAllChat
 * @description get all Messages
 */
export function getAllChat(requestData, callback) {
  const request = axios.post(`${API.getAllChats}`, requestData);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
        // dispatch({
        //     type: SET_CHILD_CATEGORY,
        //     payload: res.data
        // })
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

/**
 * @method getChatDetail
 * @description get all chat detail
 */
export function getChatDetail(requestData, callback) {
  const request = axios.post(`${API.getChatDetails}`, requestData);
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

export function updateMessage(requestData, callback) {
  const request = axios.post(`${API.updateMessages}`, requestData);
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

/**
 * @method deleteChatMessage
 * @description delete chat message
 */
export function deleteChatMessage(requestData, callback) {
  const request = axios.post(`${API.deleteChatMessage}`, requestData);
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

/**
 * @method blockUnblockChatUser
 * @description block/Unblock Chat User
 */
export function blockUnblockChatUser(requestData, callback) {
  const request = axios.post(`${API.blockUnblockChatUser}`, requestData);
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

/**
 * @method getChatDetail
 * @description get all chat detail
 */
export function sendMessageAPI(requestData, callback) {
  const request = axios.post(`${API.sendMessage}`, requestData);
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
 * @method getChatDetail
 * @description get all chat detail
 */
export function contactAdSendMessageAPI(requestData, callback) {
  const request = axios.post(`${API.contactAdSendMessage}`, requestData);

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

export async function getChatImages(requestData) {
  const request = await axios.post(`${API.getChatImages}`, requestData);
  console.log(request.data.url);
  return request.data.url;
}
