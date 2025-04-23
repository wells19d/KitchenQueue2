//* join.reducer.jsx

const initialState = {
  inviteFound: false,
  inviteData: null,
  error: false,
  errorMsg1: '',
  errorMsg2: '',
};

const joinReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_INVITE_DATA':
      return {
        ...state,
        inviteFound: true,
        inviteData: action.payload,
        error: false,
        errorMsg1: '',
        errorMsg2: '',
      };

    case 'INVITE_EXPIRED':
    case 'INVITE_NOT_FOUND':
    case 'INVITE_LOOKUP_FAILED':
      return {
        ...state,
        inviteFound: false,
        inviteData: null,
        error: true,
        errorMsg1: action.payload.msg1,
        errorMsg2: action.payload.msg2,
      };

    case 'CLEAR_INVITE_DATA':
      return initialState;

    default:
      return state;
  }
};

export default joinReducer;
