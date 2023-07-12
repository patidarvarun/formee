import axios from "axios";
import { API } from "../config/Config";
import { apiErrors } from "../config/HandleAPIErrors";
import {
  SET_MENU_OVERLAY,
  SET_CURRENT_ADDRESS,
  SET_LOCATION,
  CLOSE_LOGIN_MODEL,
  SET_CHILD_CATEGORY,
  ENABLE_LOADING,
  DISABLE_LOADING,
  SET_CLASSIFIEDS_CATEGORY_LISTING,
  FETCH_ALL_CATEGORY,
  CALL_LOADING,
  SET_SAVED_CATEGORIES,
  SET_BOOKING_CATEGORY,
  SET_BOOKING_SUBCATEGORY,
  SET_BANNER_PAGE,
  SET_BANNER,
  SET_RETAIL_LIST,
  SET_MOST_VIEW,
  ADD_TO_FAVORITE,
  LOGIN_MODEL,
  SET_FAVORITE_ITEM_ID,
  SET_CLASSIFIED_CATEGORY,
  OPEN_FORGOT_MODEL,
  CLOSE_FORGOT_MODEL,
  ADD_CHECKOUT_DATA,
  REMOVE_CHECKOUT_DATA,
} from "./Types";
import { setPriority } from "../components/classified-templates/CommanMethod";
const publicIp = require("public-ip");

let axiosConfig = {
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    Accept: "application/json",
  },
};

/**
 * @method enableLoading
 * @description enable loading
 */
export function enableLoading() {
  return (dispatch) => {
    dispatch({
      type: ENABLE_LOADING,
    });
  };
}

/**
 * @method disableLoading
 * @description enable loading
 */
export function disableLoading() {
  return (dispatch) => {
    dispatch({
      type: DISABLE_LOADING,
    });
  };
}

/**
 * @method fetchMasterDataAPI
 * @description fetch all category api
 */
export function fetchMasterDataAPI(data, callback) {
  return (dispatch) => {
    const request1 = axios.post(`${API.classifiedCategory}`, data, axiosConfig);
    const request2 = axios.post(`${API.bookingCategory}`, axiosConfig);
    const request3 = axios.post(`${API.retailCategory}`, axiosConfig);

    Promise.all([request1, request2, request3])
      .then((res) => {
        let classifiedList = res[0].data && res[0].data.newinsertcategories;
        const classifiedAll = res[0].data;
        const booking = res[1].data;
        const retail = res[2].data;
        const classified =
          Array.isArray(classifiedList) &&
          classifiedList.filter((el) => el.pid === 0);

        // static condition apply 22-01-2021
        const classifiedFilteredCategory =
          Array.isArray(classifiedList) &&
          classifiedList.filter((el) => {
            if (
              el.slug === "commercial real estate" ||
              el.slug === "Residential Real Estate"
            ) {
              return el;
            } else if (el.pid === 0 && el.slug !== "Real Estate") {
              return el;
            }
          });
        const masterData = {
          classified,
          booking,
          retail,
          classifiedAll,
          classifiedFilteredCategory,
        };
        callback(masterData);
        dispatch({
          type: FETCH_ALL_CATEGORY,
          payload: masterData,
        });
      })
      .catch((error) => {
        // apiErrors(error);
        callback(error);
      });
  };
}

/**
 * @method getChildCategory
 * @description get child  category
 */
export function getChildCategory(requestData, callback) {
  const request = axios.post(`${API.childCategory}`, requestData);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
        dispatch({
          type: SET_CHILD_CATEGORY,
          payload: res.data,
        });
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

/**
 * @method bookingCategory
 * @description get all booking category
 */
export function getBookingCategory(callback) {
  const request = axios.post(`${API.bookingCategory}`, axiosConfig);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
        dispatch({
          type: SET_BOOKING_CATEGORY,
          payload: res.data,
        });
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

/**
 * @method getBookingSubcategory
 * @description get all booking sub category
 */
export function getBookingSubcategory(id, callback) {
  const request = axios.post(`${API.bookingSubCategory}?id=${id}`, axiosConfig);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
        dispatch({
          type: SET_BOOKING_SUBCATEGORY,
          payload: res.data,
        });
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

/**
 * @method postCategory
 * @description post selected category
 */
export function postCategory(requestData, callback) {
  const request = axios.post(`${API.addCategory}`, requestData);
  return (dispatch) => {
    dispatch({ type: CALL_LOADING });
    request
      .then((res) => {
        dispatch({ type: CALL_LOADING });
        callback(res);
        dispatch({
          type: SET_SAVED_CATEGORIES,
          payload: res.data,
        });
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
 * @method getUserMenuList
 * @description get logged in user menu list
 */
export function getUserMenuList(callback) {
  const request = axios.get(`${API.userMenu}`);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
        dispatch({
          type: SET_SAVED_CATEGORIES,
          payload: res.data,
        });
      })
      .catch(function (error) {
        console.log("error:# menu list", error);
        apiErrors(error);
        callback(error);
      });
  };
}

/**
 * @method menuSkip
 * @description get api for menu selection skip
 */
export function menuSkip(callback) {
  const request = axios.get(`${API.menuSkip}`);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        apiErrors(error);
        callback(error);
      });
  };
}

/**
 * @method getPageAPI
 * @description get api to get page for getting banner details
 */
export function getPageAPI(callback) {
  const request = axios.get(`${API.getBannerPage}`);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
        dispatch({
          type: SET_BANNER_PAGE,
          payload: res.data,
        });
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

/**
 * @method getBannerById
 * @description get banner by id
 */
export function getBannerById(id, callback) {
  const request = axios.get(`${API.getBannerById}/${id}`);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
        dispatch({
          type: SET_BANNER,
          payload: res.data,
        });
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

/**
 * @method getRetailList
 * @description get retail list
 */
export function getRetailList(requestData, callback) {
  const { id, recent, user_id } = requestData;
  const request = axios.post(`${API.getRetailList}`, requestData);
  return (dispatch) => {
    request
      .then((res) => {
        let filteredList = setPriority(res.data.data);
        res.data.data = filteredList;
        callback(res);
        dispatch({
          type: SET_RETAIL_LIST,
          payload: res.data.data,
        });
      })
      .catch(function (error) {
        callback(error);
        console.log("error: ", error.response);
        apiErrors(error);
      });
  };
}

/**
 * @method getMostViewdData
 * @description get most viewd data
 */
export function getMostViewdData(data, callback) {
  const request = axios.post(`${API.getMostViewd}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        let filteredList = setPriority(res.data.data.classifiedMostViewed);
        res.data.data.classifiedMostViewed = filteredList;
        callback(res);
        dispatch({
          type: SET_MOST_VIEW,
          payload: res.data.data,
        });
      })
      .catch(function (error) {
        callback(error);
        console.log("error: ", error.response);
        apiErrors(error);
      });
  };
}

/**
 * @method addToFavorite
 * @description add to favorite
 */
export function addToFavorite(requestData, callback) {
  const request = axios.post(`${API.addToFavorite}`, requestData);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
        dispatch({
          type: ADD_TO_FAVORITE,
          payload: res.data.data,
        });
      })
      .catch(function (error) {
        callback(error);
        // apiErrors(error)
      });
  };
}

/**
 * @method removeToFavorite
 * @description remove from favorite favorite
 */
export function removeToFavorite(requestData, callback) {
  const request = axios.post(`${API.removeToFavorite}`, requestData);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        callback(error);
        // apiErrors(error)
      });
  };
}

/**
 * @method openLoginModel
 * @description open login model
 */
export function openLoginModel(postAnAddRedirection = false) {
  console.log("openLoginModel ?", postAnAddRedirection);
  return (dispatch) => {
    dispatch({
      type: LOGIN_MODEL,
      payload: postAnAddRedirection,
    });
  };
}

/**
 * @method closeLoginModel
 * @description close login model
 */
export function closeLoginModel() {
  return (dispatch) => {
    dispatch({
      type: CLOSE_LOGIN_MODEL,
    });
  };
}

/**
 * @method openForgotModel
 * @description open login model
 */
export function openForgotModel(postAnAddRedirection = false) {
  return (dispatch) => {
    dispatch({
      type: OPEN_FORGOT_MODEL,
      //payload: postAnAddRedirection
    });
  };
}

/**
 * @method closeForgotModel
 * @description close login model
 */
export function closeForgotModel() {
  console.log("Step 2:+++");
  return (dispatch) => {
    dispatch({
      type: CLOSE_FORGOT_MODEL,
    });
  };
}

/**
 * @method setFavoriteItemId
 * @description open login model
 */
export function setFavoriteItemId(itemId) {
  return (dispatch) => {
    dispatch({
      type: SET_FAVORITE_ITEM_ID,
      payload: itemId,
    });
  };
}

/**
 * @method applyFilterAttributes
 * @description get all Filters
 */
export function applyClassifiedFilterAttributes(requestData, callback) {
  const request = axios.post(`${API.getClassifiedFilterAttibute}`, requestData);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res.data);
        dispatch({
          type: SET_CLASSIFIEDS_CATEGORY_LISTING,
          payload: res.data,
        });
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        // apiErrors(error)
        callback(error);
      });
  };
}

/**
 * @method applyFilterAttributes
 * @description get all Filters
 */
export function saveSearch(requestData, callback) {
  const request = axios.post(`${API.savesearchlist}`, requestData);
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
 * @method applyFilterAttributes
 * @description get all Filters
 */
export function getSaveSearchList(requestData, callback) {
  const request = axios.post(`${API.getSavesearchlist}`, requestData);
  return (dispatch) => {
    request
      .then((res) => {
        console.log("res:## ", res);
        callback(res.data);
      })
      .catch(function (error) {
        console.log("error: ##", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

/**
 * @method editSaveSearchList
 * @description get Saved Filter
 */
export function editSaveSearchList(requestData, callback) {
  const request = axios.post(`${API.editSavedSearch}`, requestData);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res.data);
      })
      .catch(function (error) {
        console.log("error: ## ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

/**
 * @method deleteSaveSearchList
 * @description delete Saved Filter
 */
export function deleteSaveSearchList(requestData, callback) {
  const request = axios.post(`${API.deleteSavedSearch}`, requestData);
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
 * @method classifiedGeneralSearchOptions
 * @description get Saved Filter options shown in Auto Complete
 */
export function classifiedGeneralSearchOptions(requestData, callback) {
  const request = axios.post(
    `${API.classifiedGeneralSearchOption}`,
    requestData
  );
  return (dispatch) => {
    request
      .then((res) => {
        callback(res.data);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        callback(error);
      });
  };
}

/**
 * @method classifiedGeneralSearch
 * @description get Saved Filter options shown in Auto Complete
 */
export function classifiedGeneralSearch(requestData, callback) {
  const request = axios.post(`${API.classifiedGeneralSearch}`, requestData);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res.data);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        callback(error);
      });
  };
}

/**
 * @method callForPopularSearch
 * @description call to increase  PopularSearch
 */
export function addCallForPopularSearch(requestData, callback) {
  const request = axios.post(`${API.callForPopularSearch}`, requestData);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res.data);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        callback(error);
      });
  };
}

/**
 * @method addReveiw
 * @description add review
 */
export function addReveiw(requestData, callback) {
  const request = axios.post(`${API.addReview}`, requestData);
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
 * @method addToWishList
 * @description add withlist for classified item
 */
export function addToWishList(requestData, callback) {
  const request = axios.post(`${API.addWishList}`, requestData);
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
 * @method removeToWishList
 * @description remove from withlist of classified item
 */
export function removeToWishList(requestData, callback) {
  const request = axios.post(`${API.removeWishList}`, requestData);
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
 * @method getOccupationType
 * @description get occupation type for classified and retail
 */
export function getOccupationType(requestData, callback) {
  const request = axios.post(`${API.getOccupationType}`, requestData);
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
 * @method getPopularSearchCities
 * @description get PopularSearchCities type for classified job
 */
export function getPopularSearchCitiesOptions(requestData, callback) {
  const request = axios.post(`${API.getPopularSearchCities}`, requestData);
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
 * @method getSearchesByCity
 * @description get PopularSearchCities type for classified job
 */
export function getPopularSearchByCity(requestData, callback) {
  const request = axios.post(`${API.getSearchesByCity}`, requestData);
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
 * @method setFavoriteItemId
 * @description open login model
 */
export function setLatLong(res) {
  return (dispatch) => {
    dispatch({
      type: SET_LOCATION,
      payload: res,
    });
  };
}

/**
 * @method setFavoriteItemId
 * @description open login model
 */
export function setCurrentLocation(res) {
  console.log("location res", res);
  return (dispatch) => {
    dispatch({
      type: SET_CURRENT_ADDRESS,
      payload: res,
    });
  };
}

export function spaVendorBookingDispute(requestData, callback) {
  const request = axios.post(
    `${API.spaTraderServiceBookingDispute}`,
    requestData
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

export function beautyVendorBookingDispute(requestData, callback) {
  const request = axios.post(
    `${API.beautyTraderServiceBookingDispute}`,
    requestData
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

export function getClientSeceretKey(requestData, callback) {
  const request = axios.post(`${API.fetchStripeSeceret}`, requestData);
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

export function getStripeToken(requestData, callback) {
  const request = axios.post(`${API.fetchStripeToken}`, requestData);
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

export function savedStripeCard(token, callback) {
  const request = axios.post(`${API.saveStripeCard}?stripeToken=${token}`);
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
 * @method controlMenuDropdown
 * @description control menu dropdown
 */
export function controlMenuDropdown(res) {
  return (dispatch) => {
    dispatch({
      type: SET_MENU_OVERLAY,
      payload: res,
    });
  };
}

/**
 * @method reportThisAd
 * @description report this Ad
 */
export function reportThisAd(requestData, callback) {
  const request = axios.post(API.reportAd, requestData);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        // console.log('error: ', error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

/**
 * @method likeThisReview
 * @description like this Review
 */
export function likeThisReview(requestData, callback) {
  const request = axios.post(API.likeOnReview, requestData);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        // console.log('error: ', error.response);
        apiErrors(error);
        callback(error);
      });
  };
}

/**
 * @method jobSubSubcategory
 * @description get job sub sub category
 */
export function getJobSubSubCategories(reqData, callback) {
  const request = axios.post(`${API.jobSubSubcategory}`, reqData);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        apiErrors(error);
        callback(error);
      });
  };
}

/**
 * @method addCheckoutData
 * @description store checkout data
 */
export function addCheckoutData(data) {
  return (dispatch) => {
    dispatch({
      type: ADD_CHECKOUT_DATA,
      data,
    });
  };
}

/**
 * @method removeCheckoutData
 * @description store checkout data
 */
export function removeCheckoutData() {
  return (dispatch) => {
    dispatch({
      type: REMOVE_CHECKOUT_DATA,
    });
  };
}
