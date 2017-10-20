import layoutsIncluded from '../layouts-included';
import { LAYOUT_CHANGE } from 'constants';
import config from 'config/config';

const initialState = {
    current: config.backendLayouts ? null : "layout1",
    loaded: {
      ...layoutsIncluded,
    },
};

export default function reducer( state = initialState, action ) {
  switch ( action.type ) {
    case LAYOUT_CHANGE:
      const loaded = state.loaded;

      if ( !config.backendLayouts ) {
        console.log(action.payload.code);
        return {
         ...state,
         current: action.payload.code
        };
      }

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
