
import { SET_MY_BEST_PACKAGES, SET_ELIGIBLE_PACKAGES, SET_MY_PROMO, SET_MY_OFFERS, SET_ELIGIBLE_OFFERS, SET_ELIGIBLE_PROMO, SET_MY_DEALS, SET_DEAL_FROM_ADMIN, SET_BROCHURES, SET_PORTFOLIO_FOLDER, SET_CERTIFICATIONS, SET_GALLERY } from '../../actions/Types';

/** initialize the state */
const INITIAL_STATE = {
    brochureList: [],
    certificateList: [],
    portfolioFolderList: [],
    dealFromAdmin: [],
    promoFromAdmin: [],
    offersFromAdmin: [],
    myDeals: [],
    myOffers: [],
    myPromos: [],
    myBestPackages: [],
    packagesFromAdmin: [],
    galleryList: []

}
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_CERTIFICATIONS:
            return { ...state, certificateList: action.payload.data.certifications };
        case SET_BROCHURES:
            return { ...state, brochureList: action.payload.data.brochure };
        case SET_GALLERY:
            return { ...state, galleryList: action.payload.data.certifications };
        case SET_PORTFOLIO_FOLDER:
            return { ...state, portfolioFolderList: action.payload.data.folders };
        case SET_DEAL_FROM_ADMIN:
            return { ...state, dealFromAdmin: action.payload.data };
        case SET_ELIGIBLE_PROMO:
            return { ...state, promoFromAdmin: action.payload.data };
        case SET_MY_DEALS:
            return { ...state, myDeals: action.payload.data.data };
        case SET_ELIGIBLE_OFFERS:
            return { ...state, offersFromAdmin: action.payload.data };
        case SET_MY_OFFERS:
            return { ...state, myOffers: action.payload.data.data };
        case SET_MY_PROMO:
            return { ...state, myPromos: action.payload.data.data };
        case SET_ELIGIBLE_PACKAGES:
            return { ...state, packagesFromAdmin: action.payload.data };
        case SET_MY_BEST_PACKAGES:
            return { ...state, myBestPackages: action.payload.data };
        default:
            return state;
    }
}