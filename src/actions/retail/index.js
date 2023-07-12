import axios from 'axios';
import { API } from '../../config/Config';
import { apiErrors } from '../../config/HandleAPIErrors';
import {SET_RETAIL_SUB_CATEGORIES, SET_GST_PERCENTAGE } from './../Types';

import { setPriority } from '../../components/classified-templates/CommanMethod'


/**
 * @method getRetailCategoryAutocomplete
 * @description get retail category auto complete data
 */
export function getRetailCategoryAutocomplete(data, callback) {
    const request = axios.post(`${API.retailAutocomplete}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}

/**
 * @method getRetailCategoryDetail
 * @description get retail  category detail
 */
export function getRetailCategoryDetail(data, callback) {
    const request = axios.post(`${API.getRetailDetail}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
            dispatch({
                type: SET_GST_PERCENTAGE,
                payload: res.data
            })
        }).catch(function (error) {
            console.log('error: ', error.response);
            apiErrors(error)
            callback(error);
        });
    }
}

/**
 * @method getAllRetailSearchByName
 * @description get retail category item by name
 */
export function getAllRetailSearchByName(data, callback) {
    const request = axios.post(`${API.getRetailSearchByname}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            // apiErrors(error)
            callback(error);
        });
    }
}

/**
 * @method addToCartAPI
 * @description add to cart
 */
export function addToCartAPI(data, callback) {
    const request = axios.post(`${API.addToCart}`, data)
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
 * @method addRetailReview
 * @description add to cart
 */
export function addRetailReview(data, callback) {
    const request = axios.post(`${API.addretailReview}`, data)
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
 * @method getRetailDynamicAttribute
 * @description get all input for post an add
 */
export function getRetailDynamicAttribute(data, callback) {
    const request = axios.post(`${API.getRetailAttribute}`, data)
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
 * @method applyFilterAttributes
 * @description get all Filters
 */
export function applyRetailFilter(requestData, callback) {
    const request = axios.post(`${API.applyRetailFilter}`, requestData)
    return (dispatch) => {
        request.then((res) => {
            callback(res.data);
        }).catch(function (error) {
            console.log('error: ', error.response);
            // apiErrors(error)
            callback(error);
        });
    }
}

/**
 * @method getRetailCartAPI
 * @descriptionupdate get retail cart api
 */
export function getRetailCartAPI(data, callback) {
    const request = axios.post(`${API.cartDetail}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}

/**
 * @method placeOrderAPI
 * @descriptionupdate place product order api
 */
export function placeOrderAPI(data, callback) {
    const request = axios.post(`${API.placeOrder}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}

/**
 * @method saveForLaterAPI
 * @descriptionupdate retail cart product save for later
 */
export function saveForLaterAPI(data, callback) {
    const request = axios.post(`${API.saveForLater}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}

/**
 * @method retailPostanAdAPI
 * @descriptionupdate retail post an ad api
 */
export function retailPostanAdAPI(data, callback) {
    const request = axios.post(`${API.retailPostAd}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}

/**
 * @method getAllBrandsAPI
 * @descriptionupdate get all brands api 
 */
export function getAllBrandsAPI(data, callback) {
    const request = axios.post(`${API.getBrands}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}

/**
 * @method retailPopularItems
 * @descriptionupdate get retail popular items
 */
export function retailPopularItems(data, callback) {
    const request = axios.post(`${API.getMostPopularInRetail}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}

/**
 * @method saveSearchList
 * @descriptionupdate get save search list
 */
export function saveSearchList(callback) {
    const request = axios.get(`${API.getSaveSearchList}`)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}

/**
 * @method saveSearchList
 * @descriptionupdate get save search list
 */
export function deleteSearch(data, callback) {
    const request = axios.post(`${API.deleteSavedSerch}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}

/**
 * @method retailDashboard
 * @descriptionupdate retail dashboard data
 */
export function getRetailDashboardAPI(data, callback) {
    const request = axios.post(`${API.getRetailDashboardDetail}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}

/**
 * @method createRetailSearch
 * @descriptionupdate create retail search
 */
export function createRetailSearch(data, callback) {
    const request = axios.post(`${API.createRetailSearch}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}

/**
 * @method getGSTPercentage
 * @descriptionupdate get gst percentage 
 */
export function getGSTPercentage(callback) {
    const request = axios.get(`${API.getGSTPercent}`)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
            dispatch({
                type: SET_GST_PERCENTAGE,
                payload: res.data
            })
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}


/**
 * @method getRetailPostAdDetails
 * @descriptionupdate get gst percentage 
 */
export function getRetailPostAdDetail(data, callback) {
    const request = axios.post(`${API.getRetailPostAdDetail}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}

/**
 * @method updateRetailClassified
 * @descriptionupdate update retail classified details
 */
export function updateRetailClassified(data, callback) {
    const request = axios.post(`${API.updatePostAdDetail}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}

/**
 * @method generateInvoice
 * @descriptionupdate generate invoice
 */
export function generateInvoice(callback) {
    const request = axios.get(`${API.generateInvoice}`)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}

/**
 * @method sendFormmeInvoice
 * @descriptionupdate send formee invoice
 */
export function sendFormmeInvoice(callback) {
    const request = axios.get(`${API.sendFormmeInvoice}`)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}

/**
 * @method retailPayment
 * @descriptionupdate user payment update
 */
export function retailPaymentAPI(data, callback) {
    const request = axios.post(`${API.userPaymentRetail}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}

/**
 * @method updateRetailSavedSerach
 * @descriptionupdate update retail saved search
 */
export function updateRetailSavedSerach(data, callback) {
    const request = axios.post(`${API.updateRetailSavedSearch}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}

/**
 * @method getMyRetailDeals
 * @description get a deal from Admin
 */
export function getMyRetailDeals(data, callback) {
    const request = axios.post(`${API.myRetailDeals}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
            // dispatch({
            //     type: SET_MY_DEALS,
            //     payload: res.data
            // })
        })
            .catch(function (error) {
                console.log('error: ', error);
                callback(error)
                // apiErrors(error)
            });
    }
}


/**
 * @method getRetailDealFromAdmin
 * @description get a deal from Admin
 */
export function getRetailDealFromAdmin(data, callback) {
    const request = axios.post(`${API.getRetailDealFromAdmin}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)

        })
            .catch(function (error) {
                callback(error)
                // apiErrors(error)
            });
    }
}

/**
 * @method uploadRetailProductImage
 * @descriptionupdate upload retail product images
 */
export function uploadRetailProductImage(data,callback) {
    const request = axios.post(`${API.uploadRetailImages}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}



/**
 * @method createRetailDeals
 * @description get a deal from Admin
 */
export function createRetailDeals(data, callback) {
    const request = axios.post(`${API.createRetailDeals}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res)
        })
            .catch(function (error) {
                callback(error)
                apiErrors(error)
            });
    }
}

/**
 * @method fetchMasterDataAPI
 * @description fetch all category api
 */
export function getRetailLandingPageData(data1,data2,data3, callback) {
    return (dispatch) => {
        const request1 = axios.post(`${API.newRetailList}`, data1)
        const request2 = axios.post(`${API.newRetailList}`, data2)
        const request3 = axios.post(`${API.newRetailList}`, data3)
        let masterData = {
            mostRecent:[], best_sellors:[], recently_view:[]
        };
        Promise.all([request1, request2, request3]).then((res) => {
            console.log('res', res)
            const mostRecent = res[0].data && res[0].data.data
            const best_sellors = res[1].data && res[1].data.data;
            const recently_view = res[2].data && res[2].data.data;
            masterData = {
                mostRecent, best_sellors, recently_view
            };
            callback(masterData);
        }).catch((error) => {
            callback(error);
        });
    };
}

/**
 * @method leaveFeedback
 * @description add to cart
 */
 export function leaveFeedback(data, callback) {
    const request = axios.post(`${API.leaveFeedback}`, data)
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
 * @method likeUnlikeReview
 * @description add to cart
 */
 export function likeUnlikeReview(data, callback) {
    const request = axios.post(`${API.voteRetailReview}`, data)
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
 * @method reportVendorReview
 * @description report review by vendor
 */
 export function reportVendorReview(data, callback) {
    const request = axios.post(`${API.reportRetailVendorReview}`, data)
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
 * @method replyVendorReview
 * @description reply to vendor review 
 */
 export function replyVendorReview(data, callback) {
    const request = axios.post(`${API.reply_to_vendor_review}`, data)
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
 * @method reportRetailAds
 * @description report retail ads
 */
 export function reportRetailAds(data, callback) {
    const request = axios.post(`${API.reportRetailAds}`, data)
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
 * @method removeFromCartItemAPI
 * @description remove cart item item
 */
 export function removeFromCartItemAPI(data, callback) {
    const request = axios.post(`${API.removeRetailCartItem}`, data)
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
 * @method reportUserFeedback
 * @description report user feedback
 */
 export function reportUserFeedback(data, callback) {
    const request = axios.post(`${API.reportFeedback}`, data)
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
 * @method voteRetailFeedback
 * @description vote retail feedback
 */
 export function voteRetailFeedback(data, callback) {
    const request = axios.post(`${API.voteFeedback}`, data)
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
 * @method addtoWishList
 * @description vote retail feedback
 */
 export function addToRetailWishList(data, callback) {
    const request = axios.post(`${API.adRetailToWishlist}`, data)
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
 * @method voteRetailFeedback
 * @description vote retail feedback
 */
 export function removeToRetailWishlist(data, callback) {
    const request = axios.post(`${API.removeRetailToWishlist}`, data)
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
 * @method editRetailReview
 * @description edit retail review
 */
 export function editRetailReview(data, callback) {
    const request = axios.post(`${API.updateRetailReview}`, data)
    return (dispatch) => {
        request.then((res) => {
            console.log("deep",res)
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            apiErrors(error)
            callback(error);
        });
    }
}


/**
 * @method fedexAPI
 * @description edit retail review
 */
 export function fedexAPI(data, callback) {
    const request = axios.post(`${API.fexedPostageList}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            // apiErrors(error)
            callback(error);
        });
    }
}

/**
 * @method retailVendorOrderList
 * @description retail vendor order list
 */
 export function retailVendorOrderList(data, callback) {
    const request = axios.post(`${API.getRetailVendorOrderList}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            // apiErrors(error)
            callback(error);
        });
    }
}

/**
 * @method getOrderDetails
 * @description retail order details
 */
 export function getOrderDetails(data, callback) {
    const request = axios.post(`${API.getOrderDetails}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            // apiErrors(error)
            callback(error);
        });
    }
}

/**
* @method setRetailSubCategories
* @description set retail subcategories
*/
export function setRetailSubCategories(item) {
    return (dispatch) => {
        dispatch({
            type: SET_RETAIL_SUB_CATEGORIES,
            payload: item
        })
    }
}

/**
* @method retailUserAdsAPI
* @description retail user ads
*/
export function retailUserAdsAPI(data,callback) {
    const request = axios.post(`${API.foundRetailUserAds}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}

export function getPaymentOrder(data,callback) {
    const request = axios.post(`${API.getOrderDetailsById}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            callback(error);
        });
    }
}