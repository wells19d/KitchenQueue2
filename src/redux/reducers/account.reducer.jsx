//* account.reducer.jsx
const initialState = {
  account: null,
  allowedProfiles: [],
  error: null,
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    // ✅ Account set or created
    case 'SET_ACCOUNT':
    case 'ACCOUNT_CREATE_SUCCESS':
      return {...state, account: action.payload, error: null};

    case 'ACCOUNT_CREATE_FAILURE':
    case 'ACCOUNT_FETCH_FAILED':
      return {...state, error: action.payload};

    // ✅ Allowed profiles
    case 'SET_ALLOWED_PROFILES':
      return {...state, allowedProfiles: action.payload};
    case 'FETCH_ALLOWED_PROFILES_FAILED':
      return {...state, error: action.payload};

    // 🔄 Reset
    case 'RESET_ACCOUNT_STATE':
    case 'RESET_ALL_STATE':
      return initialState;

    default:
      return state;
  }
};

export default accountReducer;
