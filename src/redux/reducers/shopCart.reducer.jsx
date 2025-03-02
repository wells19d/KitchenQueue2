//*shopping.reducer.jsx
const initialState = {
  shopping: null,
  loading: false,
  error: null,
};

const shoppingReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_SHOP_CART':
      return {...state, loading: true, error: null};
    case 'SET_SHOP_CART':
      return {...state, shopping: action.payload, loading: false, error: null};
    case 'SHOP_CART_FETCH_FAILED':
      return {...state, loading: false, error: action.payload};

    case 'ADD_ITEM_TO_SHOP_CART':
      return {...state, loading: true, error: null};
    case 'SHOP_CART_ADD_ITEM_FAILED':
      return {...state, loading: false, error: action.payload};

    case 'UPDATE_ITEM_IN_SHOP_CART':
      return {...state, loading: true, error: null};
    case 'SHOP_CART_UPDATE_ITEM_FAILED':
      return {...state, loading: false, error: action.payload};

    case 'DELETE_ITEM_FROM_SHOP_CART':
      return {...state, loading: true, error: null};
    case 'SHOP_CART_DELETE_ITEM_FAILED':
      return {...state, loading: false, error: action.payload};

    case 'BATCH_TO_SHOP_CART':
      return {...state, loading: true, error: null};
    case 'SHOP_CART_BATCH_ADD_FAILED':
      return {...state, loading: false, error: action.payload};

    case 'RESET_SHOPPING_STATE':
      return initialState;
    case 'RESET_ALL_STATE':
      return initialState;

    default:
      return state;
  }
};

export default shoppingReducer;
