
import { GET_PLAN, SET_CLASSIFIEDS_CATEGORY_LISTING, SET_RESUME_DETAILS, SET_SELECTED_CLASSIFIED, PAPULAR_SEARCH, MOST_PAPULAR_RECORD } from '../../actions/Types';

/** initialize the state */
const INITIAL_STATE = {
    classifiedsList: [],
    selctedClassified: undefined,
    papularSearch: [],
    mostPapularRecord: [],
    subscriptionPlan: [],
    resumeDetails: null
}
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_CLASSIFIEDS_CATEGORY_LISTING:
            console.log('action.payload.data', action.payload.data)
            return { ...state, classifiedsList: action.payload.data };
        case SET_SELECTED_CLASSIFIED:
            return { ...state, selctedClassified: action.payload };
        case PAPULAR_SEARCH:
            return { ...state, papularSearch: action.payload };
        case MOST_PAPULAR_RECORD:
            return { ...state, mostPapularRecord: action.payload };
        case GET_PLAN:
            return { ...state, subscriptionPlan: action.payload };
        case SET_RESUME_DETAILS:
            return { ...state, resumeDetails: action.payload.data };
        default:
            return state;
    }
}