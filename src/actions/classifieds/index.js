import axios from 'axios';
import { API } from '../../config/Config';
import { apiErrors } from '../../config/HandleAPIErrors';
import { GET_PLAN, SET_CLASSIFIEDS_CATEGORY_LISTING, SET_RESUME_DETAILS, PAPULAR_SEARCH, MOST_PAPULAR_RECORD } from './../Types';
import { setPriority } from '../../components/classified-templates/CommanMethod'


/**
 * @method bookingCategory
 * @description get all booking category
 */
export function getClassfiedCategoryListing(data, callback) {
    const request = axios.post(`${API.getClassifiedListing}`, data)
    return (dispatch) => {
        request.then((res) => {
            let filteredList = setPriority(res.data.data)
            res.data.data = filteredList
            callback(res);
            dispatch({
                type: SET_CLASSIFIEDS_CATEGORY_LISTING,
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
 * @method tab List of Classified
 * @description get all booking category
 */
export function getClassfiedTabListing(mostRecentReqData, topRatedReqData, callback) {
    const mostRecentReq = axios.post(`${API.getClassifiedListing}`, mostRecentReqData)
    const topRatedReq = axios.post(`${API.getClassifiedListing}`, topRatedReqData)

    return (dispatch) => {
        axios.all([mostRecentReq, topRatedReq]).then(axios.spread((...responses) => {
            let filteredList1 = setPriority(responses[0].data.data)
            let filteredList2 = setPriority(responses[1].data.data)
            responses[0].data.data = filteredList1
            responses[1].data.data = filteredList2
            // callback(res);
            const response1 = responses[0]
            const response2 = responses[1]
            callback(response1, response2);
            // dispatch({
            //     type: SET_CLASSIFIEDS_CATEGORY_LISTING,
            //     payload: res.data
            // })
        })).catch(function (error) {
            console.log('error: ', error.response);
            apiErrors(error)
            callback(error);
        });
    }

    // axios.all([mostRecentReq, topRatedReq]).then(axios.spread((...responses) => {
    //     const response1 = responses[0]
    //     const response2 = responses[1]
    //     callback(response1, response2);
    // })).catch(error => {
    //     apiErrors(error)
    //     callback(error);
    // })

    // return (dispatch) => {
    //     request.then((res) => {
    //         let filteredList = setPriority(res.data.data)
    //         res.data.data = filteredList
    //         callback(res);
    //         dispatch({
    //             type: SET_CLASSIFIEDS_CATEGORY_LISTING,
    //             payload: res.data
    //         })
    //     }).catch(function (error) {
    //         console.log('error: ', error.response);
    //         apiErrors(error)
    //         callback(error);
    //     });
    // }
}

/**
 * @method bookingCategory
 * @description get all booking category
 */
export function getClassfiedCategoryDetail(data, callback) {
    const request = axios.post(`${API.getClassifiedDetail}`, data)
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
 * @method newInClassified
 * @description get all new classified record 
 */
export function newInClassified(data, callback) {
    const request = axios.post(`${API.newInClassified}`, data)
    return (dispatch) => {
        // dispatch({ type: CALL_LOADING })
        request.then((res) => {
            // dispatch({ type: CALL_LOADING })
            let filteredList = setPriority(res.data.data)
            res.data.data = filteredList
            callback(res);
        }).catch(function (error) {
            // dispatch({ type: CALL_LOADING })
            console.log('error: ', error.response);
            apiErrors(error)
            callback(error);
        });
    }
}


/**
 * @method popularSearch
 * @description get papular search classified record 
 */
export function papularSearch(data, callback) {
    const request = axios.post(`${API.papularSearch}`, data)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
            dispatch({
                type: PAPULAR_SEARCH,
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
 * @method mostPapularList
 * @description get most papular classified record 
 */
export function mostPapularList(callback) {
    const request = axios.get(`${API.mostPapular}`)
    return (dispatch) => {
        request.then((res) => {
            let filteredList = setPriority(res.data.feactured_category)
            res.data.feactured_category = filteredList
            callback(res);
            dispatch({
                type: MOST_PAPULAR_RECORD,
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
 * @method subscriptionPlan
 * @description get list of subscription plan
 */
export function subscriptionPlan(callback) {
    const request = axios.post(`${API.getSubscriptionPlan}`)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
            dispatch({
                type: GET_PLAN,
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
 * @method savePlanAPI
 * @description used to save selected paln details
 */
export function savePlanDetailsAPI(data, callback) {
    const request = axios.post(`${API.savePlanDetails}`, data)
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
 * @method CreateResume
 * @description get list of subscription plan
 */
export function createResume(reqData, callback) {
    const headers = { 'Content-Type': 'multipart/form-data' }
    const request = axios.post(`${API.createResume}`, reqData, headers)
    return (dispatch) => {
        request.then((res) => {
            callback(res);
            // dispatch({
            //     type: GET_PLAN,
            //     payload: res.data
            // })
        }).catch(function (error) {
            console.log('error: ', error.response);
            apiErrors(error)
            callback(error);
        });
    }
}

/**
 * @method getResume
 * @description get list of subscription planResume
 */
export function getResume(callback) {
    const request = axios.get(`${API.getResume}`)
    return (dispatch) => {
        request.then((res) => {
            console.log('res:getResumene action ', res);
            callback(res);
            dispatch({
                type: SET_RESUME_DETAILS,
                payload: res.data
            })
        })
    }
}



/**
* @method makeAnOfferAPI
* @description make an offer api
*/
export function makeAnOfferAPI(requestData, callback) {
    const request = axios.post(`${API.makeAnOffer}`, requestData)
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
 * @method applyForJobAPI
 * @description apply for an job 
 */
export function applyForJobAPI(requestData, callback) {
    // const headers = { 'Content-Type': 'multipart/form-data' }
    const request = axios.post(`${API.applyJobAPI}`, requestData)
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
 * @method deleteUploadedFile
 * @description delete uloaded files
 */
export function deleteUploadedFile(id, callback) {
    const request = axios.delete(`${API.deleteUploadedFiles}/${id}`)
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
 * @method bookAnInspectionAPI
 * @description book for an inspection
 */
export function bookAnInspectionAPI(requestData, callback) {
    const request = axios.post(`${API.bookAnInspection}`, requestData)
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
 * @method getJobQuestions
 * @description get all job Questions
 */
export function getJobQuestions(data, callback) {
    const request = axios.post(`${API.getJobQuestions}`, data)
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
 * @method foundAdsAPI
 * @description found ads api
 */
export function foundClassifiedUserAdsAPI(data, callback) {
    const request = axios.post(`${API.foundUserAds}`, data)
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
 * @method newClassifiedList
 * @description new classified list
 */
export function newClassifiedList(data, callback) {
    const request = axios.post(`${API.newClassifiedList}`, data)
    return (dispatch) => {
        request.then((res) => {
            // let filteredList = setPriority(res.data.data)
            // res.data.data = filteredList
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            // apiErrors(error)
            callback(error);
        });
    }
}

/**
 * @method fetchMasterDataAPI
 * @description fetch all category api
 */
export function getClassifiedLandingPageData(data1,data2,data3, callback) {
    return (dispatch) => {
        const request1 = axios.post(`${API.newClassifiedList}`, data1)
        const request2 = axios.post(`${API.newClassifiedList}`, data2)
        const request3 = axios.post(`${API.newClassifiedList}`, data3)
        Promise.all([request1, request2, request3]).then((res) => {
            const mostRecent = res[0].data && res[0].data.data
            const top_rated = res[1].data && res[1].data.data;
            const recently_view = res[2].data && res[2].data.data;
            const masterData = {
                mostRecent, top_rated, recently_view
            };
            callback(masterData);
        }).catch((error) => {
            callback(error);
        });
    };
}


/**
 * @method foundAdsAPI
 * @description found ads api
 */
 export function reportUserReviewAPI(data, callback) {
    const request = axios.post(`${API.reportUserReview}`, data)
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
 * @method editClassifiedReview
 * @description edit classified review
 */
 export function editClassifiedReview(data, callback) {
    const request = axios.post(`${API.updateClassifiedReview}`, data)
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
 * @method getJobApplicantDetails
 * @description get questions of job applicant and its submitted answer by job applicant
 * @data job_id
 */
export function getJobApplicantDetails(data, callback){
    const request = axios.post(`${API.getJobApplicantDetails}`, data)
    return (dispatch) => {
        request.then((res) => {
            console.log('res: ', res);
            callback(res);
        }).catch(function (error) {
            console.log('error: ', error.response);
            apiErrors(error)
            callback(error);
        });
    }
}