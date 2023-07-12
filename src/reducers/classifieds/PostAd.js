
import { STEP1, STEP2, STEP3, STEP4, FILE_LIST, PREVIEW} from '../../actions/Types';

/** initialize the state */
const INITIAL_STATE = {
    step1: '',
    attributes: '',
    step3: '',
    step4: '',
    fileList: [],
    preview: ''
}
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case STEP1:
            return { ...state, step1: action.payload };
        case STEP2:
            return { ...state, attributes: action.payload };
        case STEP3:
            return { ...state, step3: action.payload };
        case STEP4:
            return { ...state, step4: action.payload };
        case FILE_LIST:
            return { ...state, allImages: action.payload };
        case PREVIEW:
            return { ...state, preview: action.payload };
        default:
            return state;
    }
}