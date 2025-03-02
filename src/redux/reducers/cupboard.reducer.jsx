//*cupboard.reducer.jsx
const initialState = {
  cupboard: null,
  loading: false,
  error: null,
};

const cupboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_CUPBOARD':
      return {...state, loading: true, error: null};
    case 'SET_CUPBOARD':
      return {...state, cupboard: action.payload, loading: false, error: null};
    case 'CUPBOARD_FETCH_FAILED':
      return {...state, loading: false, error: action.payload};

    case 'ADD_ITEM_TO_CUPBOARD':
      return {...state, loading: true, error: null};
    case 'CUPBOARD_ADD_ITEM_FAILED':
      return {...state, loading: false, error: action.payload};

    case 'UPDATE_ITEM_IN_CUPBOARD':
      return {...state, loading: true, error: null};
    case 'CUPBOARD_UPDATE_ITEM_FAILED':
      return {...state, loading: false, error: action.payload};

    case 'DELETE_ITEM_FROM_CUPBOARD':
      return {...state, loading: true, error: null};
    case 'CUPBOARD_DELETE_ITEM_FAILED':
      return {...state, loading: false, error: action.payload};

    case 'BATCH_ADD_TO_CUPBOARD':
      return {...state, loading: true, error: null};
    case 'CUPBOARD_BATCH_ADD_FAILED':
      return {...state, loading: false, error: action.payload};

    case 'RESET_CUPBOARD_STATE':
      return initialState;
    case 'RESET_ALL_STATE':
      return initialState;
    default:
      return state;
  }
};

export default cupboardReducer;
