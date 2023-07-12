import { reactLocalStorage } from "reactjs-localstorage";

/**
 * @method setLocalStorage
 * @description set local storage
 */
export const setLocalStorage = (res) => {
  /**Store user credentials and login detail in sessionStorage variable */
  reactLocalStorage.set("isLoggedIn", "true");
  reactLocalStorage.set("authToken", JSON.stringify(res.data.token));
  reactLocalStorage.set("loggedInDetail", JSON.stringify(res.data));
};

/**
 * @method setCustomLocalStorage
 * @description set local storage
 */
export const setCustomLocalStorage = (key, res) => {
  /**Store user credentials and login detail in sessionStorage variable */
  reactLocalStorage.set(
    key,
    JSON.stringify(res, (k, v) => (v === undefined ? null : v))
  );
};

/**
 * @method getCustomLocalStorage
 * @description get local storage
 */
export const getCustomLocalStorage = (key) => {
  console.log(key, "keyyyyyyyyyyyyyyyyyyyyy");
  let value = reactLocalStorage.get(key);
  if (value !== undefined) {
    value = JSON.parse(value, (k, v) => (v === null ? undefined : v));
  } else {
    value = "";
  }
  return value;
};
/**
 * @method getLocalStorage
 * @description get local storage
 */
export const getLocalStorage = () => {
  let token = reactLocalStorage.get("authToken");
  if (token !== undefined) {
    token = JSON.parse(token);
  } else {
    token = "";
  }

  /**Get Stored user credentials and login detail in sessionStorage variable */
  return {
    isLoggedIn: reactLocalStorage.get("isLoggedIn"),
    loggedInDetail: reactLocalStorage.get("loggedInDetail"),
    authToken: token,
  };
};

/**
 * @method clearLocalStorage
 * @description clear local storage
 */
export const clearLocalStorage = () => {
  /**Get Stored user credentials and login detail in sessionStorage variable */
  reactLocalStorage.clear();
};

/**
 * @method setIpInLocalStorage
 * @description set Ip in local storage
 */
export const setIpInLocalStorage = (IpAddress) => {
  /**Store Ip Address in sessionStorage variable */
  reactLocalStorage.set("IpAddress", IpAddress);
};

/**
 * @method getIpInLocalStorage
 * @description set Ip in local storage
 */
export const getIpfromLocalStorage = () => {
  /**get Ip address in sessionStorage variable */
  let ip = reactLocalStorage.get("IpAddress");
  return !ip || ip === undefined ? "" : ip;
};

/**
 * @method clearLocalStorage
 * @description clear local storage
 */
export const removeLocalStorage = (key) => {
  /**Get Stored user credentials and login detail in sessionStorage variable */
  reactLocalStorage.remove(key);
};
