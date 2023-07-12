import { combineReducers } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr';
import { reducer as formReducer } from 'redux-form';
import { RESET_APP, LOGOUT } from '../actions/Types';
import { clearLocalStorage } from '../common/Methods'
// import Auth from './Auth1';
import Auth from './Auth'
import Common from './Common'
import userTypeReducer from './User'
import classifiedsReducer from './classifieds/index';
import bookingReducer from './bookings/index';
import venderReducer from './bookings/vender';
import postAd from './classifieds/PostAd'
import classifiedsVenderReducer from './classifieds/vender/index'
import retailReducer from './retail/index'
import tourReducer from './bookings/tourism'

const rootReducer = (state, action) => {
   if (action.type === RESET_APP) {
      state = undefined;
   }
   if (action.type === LOGOUT) {
      clearLocalStorage()
      state = undefined;
   }
   return allReducers(state, action);
};

/**Combine all the reducers */
const allReducers = combineReducers({
   form: formReducer,
   toastr: toastrReducer,
   // auth: Auth,
   auth: Auth,
   common: Common,
   profile: userTypeReducer,
   classifieds: classifiedsReducer,
   bookings: bookingReducer,
   postAd: postAd,
   venderDetails: venderReducer,
   classifiedsVendor:classifiedsVenderReducer,
   retail: retailReducer,
   tourism: tourReducer
});

export default rootReducer;
