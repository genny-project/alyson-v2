import {
  LAYOUT_CHANGE
} from 'constants';

const initialState = {
    current: null,
    loaded: {},
};

export default function reducer( state = initialState, action ) {
  switch ( action.type ) {
    case LAYOUT_CHANGE:
      return {
        ...state,
        current: action.payload,
      };

    default:
      return state;
  }
}
