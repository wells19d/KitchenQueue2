//* invites.reducer.jsx
const initialState = {
  existingInvite: null,
  error: null,
};

const invitesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_EXISTING_INVITE':
      return {
        ...state,
        existingInvite: action.payload,
        error: null,
      };
    case 'ADD_INVITE':
      return {
        ...state,
        existingInvite: action.payload,
        error: null,
      };
    case 'UPDATE_INVITE':
      return {
        ...state,
        existingInvite: {
          ...state.existingInvite,
          ...action.payload,
        },
        error: null,
      };
    case 'DELETE_INVITE':
      return {
        ...state,
        existingInvite: null,
        error: null,
      };
    case 'CLEAR_EXISTING_INVITE':
      return {
        ...state,
        existingInvite: null,
        error: null,
      };
    case 'INVITE_ACTION_FAILED':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default invitesReducer;
