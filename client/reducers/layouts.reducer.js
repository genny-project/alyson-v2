import layoutsIncluded from '../layouts-included';
import { LAYOUT_CHANGE } from 'constants';

const initialState = {
    current: null,
    loaded: {
      ...layoutsIncluded,
    },
};

export default function reducer( state = initialState, action ) {
  switch ( action.type ) {
    case LAYOUT_CHANGE:
      const loaded = state.loaded;

      if ( action.payload.data ) {
        loaded[action.payload.code] = action.payload.data;
      }

      return {
        ...state,
        current: action.payload.code,
        loaded
      };

    default:
      return state;
  }
}
