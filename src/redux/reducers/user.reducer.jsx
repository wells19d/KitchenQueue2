//*user.reducer.jsx
const initialState = {
  data: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_SIGNUP_REQUEST':
      return {...state, loading: true, error: null};
    case 'USER_SIGNUP_SUCCESS':
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
        isAuthenticated: true,
      };
    case 'USER_SIGNUP_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.error,
        isAuthenticated: false,
      };
    case 'LOGIN_REQUEST':
      return {...state, loading: true, error: null};
    case 'SET_USER':
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
        isAuthenticated: true,
      };
    case 'LOGIN_FAILED':
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };
    case 'UNSET_USER':
      return {...initialState, loading: false};
    case 'RESET_USER_STATE':
      return initialState;
    case 'RESET_ALL_STATE':
      return initialState;
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
