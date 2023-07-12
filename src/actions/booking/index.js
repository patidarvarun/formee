import axios from "axios";
import { API } from "../../config/Config";
import { apiErrors } from "../../config/HandleAPIErrors";
import {
  SET_ADDRESS,
  SET_DIETARY_TYPES,
  SET_SPORTS_COUNTRY,
  SET_POPULAR_VENUE,
  SET_FITNESS_TYPES,
  SET_POPULAR_RESTAURANT,
  SET_FOOD_TYPES,
  SET_RESTAURANT_CUSTOMER_REVIEWS,
  SET_RESTAURANT_DETAIL,
} from "./../Types";
import { setPriority } from "../../components/classified-templates/CommanMethod";

let BASE_URL = "http://10.10.10.130:4061";

/**
 * @method newInClassified
 * @description get all new classified record
 */
export function newInBookings(data, callback) {
  const request = axios.post(`${API.booking}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        let filteredList = setPriority(res.data.data);
        res.data.data = filteredList;
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
 * @method getBookingDetails
 * @description get booking details
 */
export function getBookingDetails(data, callback) {
  const request = axios.post(`${API.getBookingDetail}`, data);
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
 * @method getSportsEnquirylist
 * @description get booking details
 */
 export function getSportsEnquirylist(callback) {
  const request = axios.get(`${API.getSportsEnquirylist}`);
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
 * @method getFitnessTypes
 * @description get Event types
 */
export function getFitnessTypes(callback) {
  const request = axios.get(`${API.getFitnessTypes}`);
  return (dispatch) => {
    request
      .then((res) => {
        callback !== undefined && callback(res);
        dispatch({
          type: SET_FITNESS_TYPES,
          payload: res.data,
        });
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
        callback !== undefined && callback(error);
      });
  };
}

/**
 * @method getPopularFitnessTypes
 * @description get popular fitness type
 */
export function getPopularFitnessTypes(callback) {
  const request = axios.get(`${API.getPopularFitnessTypes}`);
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
 * @method getFitnessTypes
 * @description get Event types
 */
export function getEventTypes(reqData, callback) {
  const request = axios.get(
    `${API.getEventTypesSuggestions}/${reqData.booking_category_id}`
  );
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
        dispatch({
          type: SET_FOOD_TYPES,
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
 * @method getFoodTypes
 * @description get Event types
 */
export function getFoodTypes(callback) {
  const request = axios.get(`${API.getFoodTypes}`);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
        dispatch({
          type: SET_FOOD_TYPES,
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
 * @method getDiataries
 * @description get diataries
 */
export function getDiataries(callback) {
  const request = axios.get(`${API.getDietaries}`);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
        dispatch({
          type: SET_DIETARY_TYPES,
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
 * @method standardEats
 * @description get standard eats
 */
export function standardEats(callback) {
  const request = axios.get(`${API.standardEats}`);
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
 * @method searchByRestaurent
 * @description Search on Restaurents
 */
export function searchByRestaurent(reqData, callback) {
  const request = axios.post(`${API.searchByRestaurent}`, reqData);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
        // dispatch({
        //     type: SET_FOOD_TYPES,
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
 * @method getRestaurantDetail
 * @description get restaurant details
 */
export function getRestaurantDetail(id, filter, callback) {
  const request = axios.get(
    `${API.getRestaurentDetail}/${id}?filter=${filter}`
  );
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
        dispatch({
          type: SET_RESTAURANT_DETAIL,
          payload: res.data && res.data.data,
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
 * @method deleteRestaurantCategory
 * @description get restaurant details
 */
export function deleteRestaurantCategory(id, callback) {
  const request = axios.delete(`${API.deleteRestaurantCategory}/${id}`);
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
 * @method bulkActionRestaurant
 * @description get restaurant details
 */
export function bulkActionRestaurant(key, data, callback) {
  let apiroute = API.deleteAllCategory;
  if (key === "1") {
    apiroute = API.activateAllItems;
  } else if (key === "2") {
    apiroute = API.deleteAllItems;
  }
  const request = axios.post(`${apiroute}`, data);
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
 * @method deleteRestaurantMenu
 * @description get restaurant details
 */
export function deleteRestaurantMenu(id, callback) {
  const request = axios.delete(`${API.deleteRestaurantMenu}/${id}`);
  console.log("REQUEST",request);
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
 * @method deleteExtraChoiceOfPreparation
 * @description get restaurant details
 */
export function deleteExtraChoiceOfPreparation(id, callback) {
  const request = axios.delete(`${API.deleteExtraChoiceOfPreparation}/${id}`);
  console.log("REQUEST",request);
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
 * @method getSportsList
 * @description get sports details
 */
export function getSportsList(data, callback) {
  const request = axios.post(`${API.getSportsWiseTournament}`, data);
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
 * @method getSportsEventList
 * @description get sports details
 */
 export function getSportsEventList(data, callback) {
    const request = axios.post(`${API.getSportsEvent}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            apiErrors(error)
            callback(error);
        });
    }
}
/**
 * @method getSportsCountryList
 * @description get sports country list
 */
export function getSportsCountryList(callback) {
  const request = axios.post(`${API.getSportsCountry}`);
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
 * @method getLogo
 * @description get sports country list
 */
 export function getLogo(data, callback) {
    const request = axios.post(`${API.getLogos}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            apiErrors(error)
            callback(error);
        });
    }
}

/**
 * @method getpopularteamLogos
 * @description get sports country list
 */
export function getpopularteamLogos(data, callback) {
    const request = axios.post(`${API.getpopularteamLogos}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            apiErrors(error)
            callback(error);
        });
    }
}
/**
 * @method getSportsCityList
 * @description get sports city list
 */
export function getSportsCityList(data, callback) {
  const request = axios.post(`${API.getSportsCity}`, data);
  return (dispatch) => {
    request.then((res) => {
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
 * @method getCityList
 * @description get sports city list
 */
 export function getCityList(callback) {
  const request = axios.get(`${API.topCities}`)
  return (dispatch) => {
    request.then((res) => {
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
 * @method getSportsCityList
 * @description get sports city list
 */
 export function getPopularTeamsList(callback) {
    const request = axios.post(`${API.getPopularTeamList}`)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            apiErrors(error)
            callback(error);
        });
    }
}

/**
 * @method getSportsCityList
 * @description get sports city list
 */
 export function getTournamentTicketList(data, callback) {
    const request = axios.post(`${API.getTournamentTicketList}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            apiErrors(error)
            callback(error);
        });
    }
}

/**
 * @method submitBookingTicketForm
 * @description get sports city list
 */
 export function submitBookingTicketForm(data, callback) {
  const request = axios.post(`${API.sportsBookingTicketForm}`, data)
  return (dispatch) => {
      request.then((res) => {
          callback(res);
      }).catch(function (error) {
          console.log('error: ', error.response);
          apiErrors(error)
          callback(error);
      });
  }
}

/**
 * @method placeSportsOrder
 * @description get sports city list
 */
 export function placeSportsOrder(data, callback) {
  const request = axios.post(`${API.placeSportsOrder}`, data)
  return (dispatch) => {
      request.then((res) => {
          callback(res);
      }).catch(function (error) {
          console.log('error: ', error.response);
          apiErrors(error)
          callback(error);
      });
  }
}

/**
 * @method placeSportsOrder
 * @description get sports city list
 */
 export function placePaypalSportsOrder(data, callback) {
  const request = axios.post(`${API.placePaypalSportsOrder}`, data)
  return (dispatch) => {
      request.then((res) => {
          callback(res);
      }).catch(function (error) {
          console.log('error: ', error.response);
          apiErrors(error)
          callback(error);
      });
  }
}
/**
 * @method getCardList
 * @description get sports city list
 */
 export function getCardList(callback) {
  const request = axios.get(`${API.getCards}`)
  return (dispatch) => {
      request.then((res) => {
          callback(res);
      }).catch(function (error) {
          console.log('error: ', error.response);
          apiErrors(error)
          callback(error);
      });
  }
}

/**
 * @method getSportsDetail
 * @description get sports details
 */
export function getSportsDetail(data, callback) {
  const request = axios.post(`${API.getTounamentTickets}`, data);
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
 * @method sportsEventSearch
 * @description get sports events search
 */
export function sportsEventSearch(data, callback) {
  const request = axios.post(`${API.sportsEventSearch}`, data);
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
 * @method getBookingPopularCategories
 * @description get booking popular categories
 */
export function getBookingPopularCategories(callback) {
  const request = axios.get(`${API.getBookingPopularCat}`);
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
 * @method getPortFolioData
 * @description get port folio data
 */
export function getPortFolioData(id, callback) {
  const request = axios.get(`${API.portFolioData}/${id}`);
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
 * @method standardEats
 * @description get standard eats
 */
export function getBookingSearchAutocomplete(data, callback) {
  const request = axios.post(`${API.generalBookingAutocompleteSearch}`, data);
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

// /**
//  * @method standardEats
//  * @description get standard eats
//  */
// export function getBookingSearchAutocomplete(data, callback) {
//     const request = axios.post(`${API.getBookingAutocompleteSearch}`, data)
//     return (dispatch) => {
//         request.then((res) => {
//             callback(res);
//         }).catch(function (error) {
//             console.log('error: ', error.response);
//             // apiErrors(error)
//             callback(error);
//         });
//     }
// }

/**
 * @method getSportsSearchAutocomplete
 * @description get sports data
 */
export function getSportsSearchAutocomplete(callback) {
  const request = axios.post(`${API.getAllSports}`);
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
 * @method getSportsDetailAPI
 * @description get sports detail page data
 */
export function getSportsDetailAPI(data, callback) {
  const request = axios.post(`${API.getTounamentTickets}`, data);
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
 * @method mostPopularEvents
 * @description get all most popular events
 */
export function mostPopularEvents(callback) {
  const request = axios.get(`${API.mostpopularEvents}`);
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
 * @method mostPopularInHandyMan
 * @description most popular in handyman
 */
export function mostPopularInHandyMan(data, callback) {
  const request = axios.post(`${API.mostPolularInHandyMan}`, data);
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
 * @method getRestaurantAutocompleteList
 * @description restaurant autocomplete
 */
export function getRestaurantAutocompleteList(name, callback) {
  const request = axios.get(`${API.restaurantAutocomplete}?name=${name}`);
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
 * @method getRestaurantCustomerReviews
 * @description restaurant autocomplete
 */
export function getRestaurantCustomerReviews() {
  const request = axios.get(`${API.restaurantCustomerReviews}`);
  return (dispatch) => {
    request
      .then((res) => {
        dispatch({
          type: SET_RESTAURANT_CUSTOMER_REVIEWS,
          payload: res.data,
        });
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
      });
  };
}

/**
 * @method getPopularRestaurant
 * @description restaurant popular list
 */
export function getPopularRestaurant() {
  const request = axios.get(`${API.popularRestaurants}`);
  return (dispatch) => {
    request
      .then((res) => {
        dispatch({
          type: SET_POPULAR_RESTAURANT,
          payload: res.data,
        });
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
      });
  };
}

/**
 * @method getPopularVenues
 * @description restaurant popular list
 */
export function getPopularVenues() {
  const request = axios.get(`${API.popularVenues}`);
  return (dispatch) => {
    request
      .then((res) => {
        dispatch({
          type: SET_POPULAR_VENUE,
          payload: res.data,
        });
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        apiErrors(error);
      });
  };
}

/**
 * @method addRestaurantInFav
 * @description get all most popular events
 */
export function addRestaurantInFav(reqData, callback) {
  const request = axios.post(`${API.addRestaurantInFav}`, reqData);
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
 * @method removeRestaurantInFav
 * @description get all most popular events
 */
export function removeRestaurantInFav(reqData, callback) {
  const request = axios.post(`${API.removeRestaurantInFav}`, reqData);
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
 * @method getDailyDeals
 * @description get daily deals records
 */
export function getDailyDeals(reqData, callback) {
  const request = axios.post(`${API.getDailyDealsAPI}`, reqData);
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
 * @method getBookingPromoAPI
 * @description get daily deals records
 */
export function getBookingPromoAPI(reqData, callback) {
  const request = axios.post(`${API.getBookingPromoData}`, reqData);
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
 * @method getRestaurantSpecialOffer
 * @description get restaurants special offers
 */
export function getRestaurantSpecialOffer(reqData, callback) {
  const request = axios.post(`${API.getSpecialOffer}`, reqData);
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
 * @method setCountry
 * @description set country
 */
export function setCountry(reqData) {
  return (dispatch) => {
    dispatch({
      type: SET_SPORTS_COUNTRY,
      payload: reqData,
    });
  };
}

/**
 * @method getBestPackagesAPI
 * @description get best beauty packages api
 */
export function getBestPackagesAPI(reqData, callback) {
  const request = axios.post(`${API.getBestPackages}`, reqData);
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
 * @method markAsAttended
 * @description mark inspection as attended
 */
export function markAsAttended(reqData, callback) {
  const request = axios.post(`${API.markInspectionAsAttended}`, reqData);
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
 * @method sendEmailToBookInspection
 * @description send email to book an inspection user
 */
export function sendEmailToBookInspection(reqData, callback) {
  const request = axios.post(`${API.sendEmailToInspection}`, reqData);
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
 * @method popularSpaWellness
 * @description popular spa wellness
 */
export function popularSpaWellness(callback) {
  const request = axios.get(`${API.popularSpa}`);
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
 * @method getSportsList
 * @description get sports details
 */
export function saveToRestaurantCart(data, callback) {
  const request = axios.post(`${API.saveToRestaurantCart}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("saveToRestaurantCart error: ", error);
        apiErrors(error);
        callback(error.response);
      });
  };
}

export function getRestaurantCart(callback) {
  const request = axios.get(`${API.viewRestaurantCart}`);
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

export function updateRestaurantCart(data, callback) {
  const request = axios.post(`${API.updateRestaurantCart}`, data);
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

export function getUserAddress(callback) {
  const request = axios.get(`${API.getUserAddress}`);
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
export function retailCheckoutPay(data,callback) {
  const request = axios.post(`${API.retailCheckoutPay}`,data);
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


export function saveUserAddress(data, callback) {
  const request = axios.post(`${API.saveUserAddress}`, data);
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

export function placeRestaurantOrder(data, callback) {
  const request = axios.post(`${API.placeRestaurantOrder}`, data);
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

// restaurent order success new api
export function placeRestaurantoOrderSuccess(data, callback) {
  const request = axios.post(`${API.placeRestaurantoOrderSuccess}`, data);
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
// restaurent order success new api

export function getUserPreviousQuoteList(data, callback) {
  const request = axios.post(`${API.getUserPreviousQuote}`, data);
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

// retail vote api


export function retailVoteAPI(data, callback) {
  const request = axios.post(`${API.retailVoteAPI}`, data);
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

// tradet vote api 
export function traderVoteAPI(data, callback) {
  const request = axios.post(`${API.traderVoteAPI}`, data);
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

export function getEventVenuesList(callback) {
  const request = axios.get(`${API.getEventVenuesList}`);
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

export function applyPromocode(data, callback) {
  const request = axios.post(`${API.applyPromoCode}`, data);
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
 * User get dashboard Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getCustomerDashBoardDetails(data, callback) {
  const request = axios.post(`${API.customerDashboardDetails}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error ", error);
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User get dashboard classified orders
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function getCustomerDashBoardDetailsClassifiedOffers(data, callback) {
  const request = axios.post(
    `${API.customerDashboardDetailsClassifiedOffers}`,
    data
  );
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error ", error);
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User get dashboard classified orders
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function cancelSentOffers(data, callback) {
  const request = axios.post(`${API.cancelSentOffers}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error ", error);
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User get dashboard classified orders
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function updateSentOffers(data, callback) {
  const request = axios.post(`${API.updateSentOffers}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error ", error);
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User get dashboard classified orders
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function cancelBookedInspection(data, callback) {
  const request = axios.post(`${API.cancelBookedInspection}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error ", error);
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * User get dashboard Details
 * @param data
 * @param callback
 * @returns {function(*)}
 */
export function newLandingPageBookingList(data, callback) {
  const request = axios.post(`${API.newTraderList}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error ", error);
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * @method fetchMasterDataAPI
 * @description fetch all category api
 */
export function getBookingLandingPageData(data1, data2, data3, callback) {
  return (dispatch) => {
    const request1 = axios.post(`${API.newTraderList}`, data1);
    const request2 = axios.post(`${API.newTraderList}`, data2);
    const request3 = axios.post(`${API.newTraderList}`, data3);
    let masterData = { mostRecent: [], top_rated: [], recently_view: [] };
    Promise.all([request1, request2, request3])
      .then((res) => {
        const mostRecent =
          res[0].data && res[0].data.data ? res[0].data.data : [];
        const top_rated =
          res[1].data && res[1].data.data ? res[1].data.data : [];
        const recently_view =
          res[2].data && res[2].data.data ? res[2].data.data : [];
        masterData = {
          mostRecent,
          top_rated,
          recently_view,
        };
        callback(masterData);
      })
      .catch((error) => {
        callback(error);
      });
  };
}

/**
 * @method restaurantAutocompleteNew
 * @description restaurant auto complete new api
 */
export function restaurantAutocompleteNew(name, callback) {
  const request = axios.get(`${API.restaurantSuggestion}?name=${name}`);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        callback(error);
      });
  };
}

/**
 * @method restaurantAutocompleteNew
 * @description restaurant auto complete new api
 */
export function bookingAutocompleteNew(data, callback) {
  const request = axios.post(`${API.bookingAutocomplete}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        callback(error);
      });
  };
}

/**
 * @method restaurantAutocompleteNew
 * @description restaurant auto complete new api
 */
export function bookinglandingPageSearch(data, callback) {
  const request = axios.post(`${API.bookingSearch}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        callback(error);
      });
  };
}

/**
 * @method restaurantAutocompleteNew
 * @description restaurant auto complete new api
 */
export function voteBookingReview(data, callback) {
  const request = axios.post(`${API.voteTraderReview}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        callback(error);
      });
  };
}

/**
 * @method replyToBookingReview
 * @description reply to booking review
 */
export function replyToBookingReview(data, callback) {
  const request = axios.post(`${API.replybookingReview}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        callback(error);
        apiErrors(error);
      });
  };
}

/**
 * @method reportBookingReview
 * @description report booking review
 */
export function reportBookingReview(data, callback) {
  const request = axios.post(`${API.reportBookingReview}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: ", error.response);
        callback(error);
        apiErrors(error);
      });
  };
}

/**
* @method updateReplyRatingVendor
* @description report booking review
*/
export function updateReplyRatingVendor(data, callback) {
 const request = axios.post(`${API.updateReplyRatingVendor}`, data);
 return (dispatch) => {
   request
     .then((res) => {
       callback(res);
     })
     .catch(function (error) {
       console.log("error: ", error.response);
       callback(error);
       apiErrors(error);
     });
 };
}

/**
 * @method commentDataVendorReview
 * @description get booking details
 */
 export function commentDataVendorReview(data,callback) {
  const request = axios.post(`${API.commentDataVendorReview}`,data);

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
 * @method editBookingReview
 * @description update booking restaurants reviews
 */
export function editBookingReview(data, callback) {
  const request = axios.post(`${API.updateBookingReview}`, data);
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
 * @method addBookingReview
 * @description add booking restaurant reviews
 */
export function addBookingReview(data, callback) {
  const request = axios.post(`${API.addBookingReviews}`, data);
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
 * @method setRestaurantAddress
 * @description set restaurant address
 */
export function setRestaurantAddress(address) {
  return (dispatch) => {
    dispatch({
      type: SET_ADDRESS,
      payload: address,
    });
  };
}

/**
 * @method removeRestaurantCartAPI
 * @description remove restaurant item from cart
 */
export function removeRestaurantCartAPI(data, callback) {
  const request = axios.post(`${API.removeRestaurantCartItem}`, data);
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
 * @method reportTraderProfileAPI
 * @description report trader profile api
 */
export function reportTraderProfileAPI(data, callback) {
  const request = axios.post(`${API.reportTraderProfile}`, data);
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
 * @method globalSearch
 * @description global search
 */
export function globalSearch(data, callback) {
  const { name, user_id, location, distance } = data;
  const request = axios.get(
    `${API.globalSearchAPI}?query=${name}&user_id=${user_id}&location=${location}&distance=${distance}`
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

export function getTraderMonthBooking(data, callback) {
  const request = axios.post(`${API.getTraderMonthBooking}`, data);
  return (dispatch) => {
    request
      .then((res) => {
        callback(res);
      })
      .catch(function (error) {
        console.log("error: && ", error.response);
        apiErrors(error);
        callback(error);
      });
  };
}
