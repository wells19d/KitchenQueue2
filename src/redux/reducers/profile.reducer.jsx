//*profile.reducer.jsx
const initialState = {
  profile: null,
  error: null,
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PROFILE':
      return {...state, profile: action.payload};
    case 'PROFILE_CREATE_SUCCESS':
      return {...state, profile: action.payload, error: null};
    case 'PROFILE_CREATE_FAILURE':
      return {...state, error: action.payload};
    case 'UPDATE_PROFILE_SUCCESS':
      return {...state, profile: {...state.profile, ...action.payload}};
    case 'UPDATE_PROFILE_FAILED':
      return {...state, error: action.payload};
    case 'PROFILE_FETCH_FAILED':
      return {...state, error: action.payload};
    case 'RESET_PROFILE_STATE':
      return initialState;
    case 'RESET_ALL_STATE':
      return initialState;
    default:
      return state;
  }
};

export default profileReducer;
