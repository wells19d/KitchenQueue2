//*_root.reducer.jsx

import {combineReducers} from 'redux';
import userReducer from './user.reducer';
import profileReducer from './profile.reducer';
import accountReducer from './account.reducer';
import shoppingReducer from './shopCart.reducer';
import cupboardReducer from './cupboard.reducer';
import deviceReducer from './device.reducer';
import invitesReducer from './invites.reducer';
import edamamReducer from './edamam.reducer';

const rootReducer = combineReducers({
  user: userReducer,
  profile: profileReducer,
  account: accountReducer,
  shopping: shoppingReducer,
  cupboard: cupboardReducer,
  deviceInfo: deviceReducer,
  invites: invitesReducer,
  edamam: edamamReducer,
});

export default rootReducer;
