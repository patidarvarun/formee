import {
  SET_MENU_OVERLAY,
  SET_GST_PERCENTAGE,
  SET_CURRENT_ADDRESS,
  SET_LOCATION,
  CLOSE_LOGIN_MODEL,
  SET_CHILD_CATEGORY,
  FETCH_ALL_CATEGORY,
  SET_SAVED_CATEGORIES,
  DISABLE_LOADING,
  ENABLE_LOADING,
  CALL_LOADING,
  SET_BOOKING_CATEGORY,
  SET_BOOKING_SUBCATEGORY,
  SET_USER_MENU_LIST,
  SET_BANNER_PAGE,
  SET_BANNER,
  SET_RETAIL_LIST,
  SET_MOST_VIEW,
  LOGIN_MODEL,
  SET_FAVORITE_ITEM_ID,
  OPEN_FORGOT_MODEL,
  CLOSE_FORGOT_MODEL,
  ADD_CHECKOUT_DATA,
  REMOVE_CHECKOUT_DATA,
} from "../actions/Types";
import { act } from "react-dom/test-utils";

/** initialize the state */
const INITIAL_STATE = {
  categoryData: undefined,
  bookingCategoty: [],
  bookingSubCategory: [],
  userMenu: [],
  loading: false,
  isOpenLoginModel: false,
  isOpenForgotModel: false,
  postAnAddRedirection: false,
  savedCategories: {
    data: {
      booking: [],
      retail: [],
      classified: [],
      foodScaner: "",
    },
  },
  allRetailList: [],
  mostViewDetail: [],
  favoriteId: [],
  location: {
    lat: "",
    long: "",
  },
  amount: {
    gstAmount: "",
    commission_amount: "",
  },
  isMenuOpen: false,
  address: "",
  checkoutData: "",
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_ALL_CATEGORY:
      return { ...state, categoryData: action.payload };
    case SET_BOOKING_CATEGORY:
      return { ...state, bookingCategoty: action.payload };
    case SET_BOOKING_SUBCATEGORY:
      return { ...state, bookingSubCategory: action.payload };
    case SET_USER_MENU_LIST:
      return { ...state, userMenu: action.payload };
    case SET_SAVED_CATEGORIES:
      return { ...state, savedCategories: action.payload };
    case ENABLE_LOADING:
      return { ...state, loading: true };
    case DISABLE_LOADING:
      return { ...state, loading: false };
    case CALL_LOADING:
      return { ...state, loading: !state.loading };
    case SET_BANNER_PAGE:
      return { ...state, bannerPage: action.payload };
    case SET_BANNER:
      return { ...state, bannerData: action.payload };
    case SET_RETAIL_LIST:
      return { ...state, allRetailList: action.payload };
    case SET_MOST_VIEW:
      const mostView = action.payload;
      return {
        ...state,
        mostViewClassified: mostView.classifiedMostViewed,
        mostViewRetail: mostView.retailMostViewed,
        mostViewBooking: mostView.bookingMostViewed,
      };
    case LOGIN_MODEL:
      return {
        ...state,
        isOpenLoginModel: !state.isOpenLoginModel,
        postAnAddRedirection: action.payload,
      };
    case CLOSE_LOGIN_MODEL:
      return { ...state, isOpenLoginModel: false };
    case SET_FAVORITE_ITEM_ID:
      return { ...state, favoriteId: action.payload };
    case SET_CHILD_CATEGORY:
      return { ...state, childData: action.payload };
    case SET_LOCATION:
      return { ...state, location: action.payload };
    case SET_CURRENT_ADDRESS:
      if (action.payload) {
        let fullAdd = action.payload;
        let stateName = "";
        let city = "";
        let pincode = "",
          country = "";
        let city_code = "",
          state_code = "",
          country_code = "";
        action.payload.address_components.map((el) => {
          if (el.types[0] === "administrative_area_level_1") {
            stateName = el.long_name;
            state_code = el.short_name;
          } else if (el.types[0] === "administrative_area_level_2") {
            city = el.long_name;
            city_code = el.short_name;
          } else if (el.types[0] === "postal_code") {
            pincode = el.long_name;
          } else if (el.types[0] === "country") {
            country = el.long_name;
            country_code = el.short_name;
          }
        });
        let add = {
          location: fullAdd.formatted_address,
          lat:
            fullAdd && fullAdd.geometry && fullAdd.geometry.location
              ? fullAdd.geometry.location.lat
              : "",
          lng:
            fullAdd && fullAdd.geometry && fullAdd.geometry.location
              ? fullAdd.geometry.location.lng
              : "",
          state: stateName,
          city: city,
          pincode: pincode,
          state_code: state_code,
          city_code: city_code,
          country: country,
          country_code: country_code,
        };
        console.log("add", add);

        return { ...state, address: add };
      } else {
        return {
          ...state,
          address: {
            location: "",
            lat: "",
            lng: "",
            state: "",
            city: "",
            pincode: "",
          },
        };
      }
    case SET_GST_PERCENTAGE:
      return { ...state, amount: action.payload };
    case SET_MENU_OVERLAY:
      return { ...state, isMenuOpen: action.payload };
    case OPEN_FORGOT_MODEL:
      return {
        ...state,
        isOpenForgotModel: !state.isOpenForgotModel,
        // , postAnAddRedirection: action.payload
      };
    case CLOSE_FORGOT_MODEL:
      return { ...state, isOpenForgotModel: false };
    case ADD_CHECKOUT_DATA:
      return { ...state, checkoutData: action.data };
    case REMOVE_CHECKOUT_DATA:
      return { ...state, checkoutData: "" };

    default:
      return state;
  }
};
