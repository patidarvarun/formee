import { TEMPLATE } from '../config/Config'
import { langs } from '../config/localization'

/**
  * @method getClassifiedCatLandingRoute
  * @description handle classified landing page routes
  */
export const getClassifiedCatLandingRoute = (template, catId, catName) => {
    if (template === TEMPLATE.JOB) {
        return `/classifieds-jobs/${catName}/${catId}`
    } else if (template === TEMPLATE.REALESTATE) {
        return `/classifieds-realestate/${catName}/${catId}`
    } else if (template === TEMPLATE.GENERAL) {
        return `/classifieds-general/${catName}/${catId}`
    }
}

/**
  * @method getClassifiedDetailPageRoute
  * @description handle classified detail page routes
  */
export const getClassifiedDetailPageRoute = (template, catId, catName, classifiedId) => {
    if (template === TEMPLATE.JOB) {
        return `/classifieds-jobs/detail-page/${catId}/${classifiedId}`
    } else if (template === TEMPLATE.REALESTATE) {
        return `/classifieds-realestate/detail-page/${catId}/${classifiedId}`
    } else if (template === TEMPLATE.GENERAL) {
        return `/classifieds-general/detail-page/${catId}/${classifiedId}`
    }
}

/**
  * @method getClassifiedSubcategoryRoute
  * @description handle classified sub category page routes
  */
export const getClassifiedSubcategoryRoute = (template, catName, catId, subCatName, subCatId, all) => {
    if (all === true) {
        if (template === TEMPLATE.JOB) {
            return `/classifieds-jobs/all/all-sub-categories/${catName}/${catId}`
        } else {
            return `/classifieds/all/${template}/all-sub-categories/${catName}/${catId}`
        }
    } else if (template === TEMPLATE.REALESTATE) {
        return `/classifieds-realestate/${catName}/${catId}/${subCatName}/${subCatId}`
    } else if (template === TEMPLATE.GENERAL) {
        return `/classifieds-general/${catName}/${catId}/${subCatName}/${subCatId}`
    } else if (template === TEMPLATE.JOB) {
        return `/classifieds-jobs/${catName}/${catId}/${subCatName}/${subCatId}`
    }
}

/**
  * @method getMapViewRoute
  * @description handle map view page routes
  */
export const getMapViewRoute = (template, catName, catId, subCatName, subCatId, all) => {
    if(template === 'retail'){
        if (all === true) {
            return `/retail-classifieds/all/map-view/${template}/${catName}/${catId}`
        } else {
            return `/retail-classifieds/map-view/${template}/${catName}/${catId}/${subCatName}/${subCatId}`
        }
    }else {
        if (all === true) {
            return `/classifieds/all/map-view/${template}/${catName}/${catId}`
        } else {
            return `/classifieds/map-view/${template}/${catName}/${catId}/${subCatName}/${subCatId}`
        }
    }
}

/**
  * @method getFilterRoute
  * @description handle filter page routes
  */
export const getFilterRoute = (catName, catId, subCatName, subCatId, all) => {
    if (all === true) {
        return `/classifieds/filter/${langs.key.all}/${catName}/${catId}`
    } else {
        return `/classifieds/filter/${catName}/${catId}/${subCatName}/${subCatId}`
    }
}

/**
  * @method getMapDetailRoute
  * @description handle map view page routes
  */
export const getMapDetailRoute = (template, catName, catId, subCatName, subCatId, classifiedId) => {
    return `/classifieds/map-view/${template}/${catName}/${catId}/${subCatName}/${subCatId}/${classifiedId}`
}

/**
  * @method getBookingCatLandingRoute
  * @description handle classified landing page routes
  */
export const getBookingCatLandingRoute = (template, catId, catName, all = false) => {
    if (all === true) {
        return `/bookings/:all/${catName}/${catId}`
    } else if (template === TEMPLATE.HANDYMAN) {
        // return `/bookings/${template}/${catId}`
        return `/bookings-handyman/${catId}`
    } else if (template === TEMPLATE.BEAUTY) {
        return `/bookings-beauty/${catId}`
    } else if (template === TEMPLATE.EVENT) {
        return `/bookings-events/${catId}`
    } else if (template === TEMPLATE.WELLBEING) {
        return `/bookings-wellbeing/${catId}`
    } else if (template === TEMPLATE.RESTAURANT) {
        return `/bookings-restaurant/${catId}`
    } else if (template === TEMPLATE.PSERVICES) {
        return `/bookings-professional-services/${catId}`
    }else if (template === TEMPLATE.SPORTS) {
        return `/bookings-sports-tickets/${catId}`
    }else if (template === TEMPLATE.TURISM) {
        return `/bookings-tourism/${catId}`
    }
    
}

/**
  * @method getBookingSubcategoryRoute
  * @description handle classified sub category page routes
  */
export const getBookingSubcategoryRoute = (template, catName, catId, subCatName, subCatId, all) => {
    if (all === true) {
        return `/bookings/all/${catName}/${catId}`
    } else if (template === TEMPLATE.HANDYMAN) {
        return `/bookings/${catName}/${catId}/${subCatName}/${subCatId}`
    } else if (template === TEMPLATE.BEAUTY) {
        return `/bookings-category/${catName}/${catId}/${subCatName}/${subCatId}`
    } else if (template === TEMPLATE.EVENT) {
        return `/bookings-category/${catName}/${catId}/${subCatName}/${subCatId}`
    } else if (template === TEMPLATE.WELLBEING) {
        return `/bookings-category/${catName}/${catId}/${subCatName}/${subCatId}`
    }else if (template === TEMPLATE.TURISM && subCatName === 'Flights'){
        return `/bookings-flight-tourism/${catName}/${catId}/${subCatName}/${subCatId}`
    }else if (template === TEMPLATE.TURISM && subCatName === 'Cars'){
        return `/bookings-car-tourism/${catName}/${catId}/${subCatName}/${subCatId}`
    }else if (template === TEMPLATE.TURISM && subCatName === 'Hotels'){
        return `/bookings-hotel-tourism/${catName}/${catId}/${subCatName}/${subCatId}`
    }else if (template === TEMPLATE.TURISM && subCatName === 'Tours & Attractions'){
        return `/bookings-car-tourism/${catName}/${catId}/${subCatName}/${subCatId}`
    }  else if (template === catName){
        return `/bookings/${catName}/${catId}/${subCatName}/${subCatId}`
    } 
}

/**
  * @method getBookingSearchRoute
  * @description handle classified sub category page routes
  */
export const getBookingSearchRoute = (template, catName, catId, subCatName, subCatId, all) => {
    if (all === true) {
        return `/bookings/all/${catName}/${catId}`
    } else if (template === TEMPLATE.HANDYMAN) {
        return `/bookings/${catName}/${catId}/${subCatName}/${subCatId}`
    } else if (template === TEMPLATE.BEAUTY) {
        return `/bookings-search/${catName}/${catId}/${subCatName}/${subCatId}`
    } else if (template === TEMPLATE.EVENT) {
        return `/bookings-search/${catName}/${catId}/${subCatName}/${subCatId}`
    } else if (template === TEMPLATE.WELLBEING) {
        return `/bookings-search/${catName}/${catId}/${subCatName}/${subCatId}`
    } else if (template === TEMPLATE.RESTAURANT) {
        return `/bookings-search/${catName}/${catId}`
    }
}

/**
  * @method getBookingDetailPageRoute
  * @description handle booking detail page routes
  */
export const getBookingDetailPageRoute = (template, catId, catName, itemId) => {
    if (template === TEMPLATE.HANDYMAN) {
        return `/bookings-detail/${template}/${catId}/${itemId}`
    } else if (template === TEMPLATE.BEAUTY) {
        return `/bookings-detail/${template}/${catId}/${itemId}`
    } else if (template === TEMPLATE.WELLBEING) {
        return `/bookings-detail/${template}/${catId}/${itemId}`
    } else if (template === TEMPLATE.EVENT) {
        return `/bookings-detail/${template}/${catId}/${itemId}`
    } else if (template === TEMPLATE.PSERVICES) {
        return `/bookings-detail/${catName}/${catId}/${itemId}`
    } else if (template === TEMPLATE.RESTAURANT) {
        
        return `/bookings-restaurant-detail/${template}/${catId}/${itemId}`
    }
}

/**
  * @method getBookingDetailPageRoute
  * @description handle booking detail page routes
  */
export const getBookingSubCatDetailRoute = (template, catId, subCatId, subCatName, itemId,catName) => {
    if (template === TEMPLATE.HANDYMAN) {
        return `/bookings-detail/${template}/${catId}/${subCatName}/${subCatId}/${itemId}`
    } else if (template === TEMPLATE.BEAUTY) {
        return `/bookings-detail/${template}/${catId}/${subCatName}/${subCatId}/${itemId}`
    } else if (template === TEMPLATE.WELLBEING) {
        return `/bookings-detail/${template}/${catId}/${subCatName}/${subCatId}/${itemId}`
    } else if (template === TEMPLATE.EVENT) {
        return `/bookings-detail/${template}/${catId}/${subCatName}/${subCatId}/${itemId}`
    } else if (template === catName) {
    //  else if (template === TEMPLATE.PSERVICES) {
        return `/bookings-detail/${template}/${catId}/${itemId}`
    } else if (template === TEMPLATE.RESTAURANT) {        
        return `/bookings-restaurant-detail/${template}/${catId}/${itemId}`
    }
}

/**
  * @method getBookingDailyDealsDetailRoutes
  * @description handle booking daily deals detail page routes
  */
 export const getBookingDailyDealsDetailRoutes = (template, catId, subCatId, subCatName, itemId) => {
    if (template === TEMPLATE.HANDYMAN) {
        return `/bookings-detail/${'daily-deals'}/${template}/${catId}/${subCatName}/${subCatId}/${itemId}`
    } else if (template === TEMPLATE.BEAUTY) {
        return `/bookings-detail/${'daily-deals'}/${template}/${catId}/${subCatName}/${subCatId}/${itemId}`
    } else if (template === TEMPLATE.WELLBEING) {
        return `/bookings-detail/${'daily-deals'}/${template}/${catId}/${subCatName}/${subCatId}/${itemId}`
    } else if (template === TEMPLATE.EVENT) {
        return `/bookings-detail/${'daily-deals'}/${template}/${catId}/${subCatName}/${subCatId}/${itemId}`
    } else if (template === TEMPLATE.PSERVICES) {
        return `/bookings-detail/${'daily-deals'}/${template}/${catId}/${itemId}`
    } else if (template === TEMPLATE.RESTAURANT) {
        
        return `/bookings-restaurant-detail/${template}/${catId}/${itemId}`
    }
}


/**
  * @method getBookingMapViewRoute
  * @description handle map view page routes
  */
export const getBookingMapViewRoute = (template, catName, catId, subCatName, subCatId, all) => {
    if (all === true) {
        return `/bookings-map-view/all/${catName}/${catId}`
    } else if(subCatId === undefined) {
        return `/bookings-map-view/${catName}/${catId}`
    } else {
        return `/bookings-map-view/${catName}/${catId}/${subCatName}/${subCatId}`
    }
}

/**
  * @method getBookingMapDetailRoute
  * @description get booking map detail route
  */
 export const getBookingMapDetailRoute = (template, catName, catId, subCatName, subCatId, itemId) => {
    return `/booking/map-view/${catName}/${catId}/${subCatName}/${subCatId}/${itemId}`
}


/**
 * @method getBookingSportsSearchRoute
 * @description handle booking serach page route
 */
export const getBookingSportsSearchRoute = (catName, catId) => {
        return `/bookings-sports-search/${catId}`
}

// /------------------- M4 Retail Routes---------------------------/

/**
  * @method getRetailCatLandingRoutes
  * @description get retail categoriy landing page routes
  */
 export const getRetailCatLandingRoutes = (catId, catName) => {
     
    return `/retail/${catName}/${catId}`
}

/**
  * @method getRetailSubcategoryRoute
  * @description handle retail sub category page routes
  */
 export const getRetailSubcategoryRoute = (catName, catId, subCatName, subCatId) => {
    return `/retail/${catName}/${catId}/${subCatName}/${subCatId}`
 }

 /**
  * @method getRetailDetailPageRoute
  * @description handle classified detail page routes
  */
export const getRetailDetailPageRoute = (catId, catName, classifiedId) => {
    return `/retail/detail-page/${catId}/${classifiedId}`
}

/**
  * @method getRetailFilterRoute
  * @description handle filter retail route
  */
 export const getRetailFilterRoute = (catName, catId, subCatName, subCatId, all) => {
    if (all === true) {
        return `/retail-category/filter/${langs.key.all}/${catName}/${catId}`
    } else {
        return `/retail/filter/${catName}/${catId}/${subCatName}/${subCatId}`
    }
}
