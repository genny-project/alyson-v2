import layoutsIncluded from '../layouts-included';
import { LAYOUT_CHANGE, CMD_VIEW, SUBLAYOUT } from 'constants';
import config from 'config/config';

const initialState = {
    current: config.backendLayouts ? null : "layout1",
    loaded: {
      ...layoutsIncluded,
  },
  sublayout: {}
};

export default function reducer( state = initialState, action ) {
  switch ( action.type ) {

    case LAYOUT_CHANGE:

      const loaded = state.loaded;

      if ( !config.backendLayouts ) {
        return {
         ...state,
         current: action.payload.code
        };
      }

      if (action.payload.data) {
        loaded[action.payload.code] = action.payload.data;
      }

      return {
        ...state,
        current: action.payload.code,
        loaded
      };

    case CMD_VIEW:

        const newLayoutCode = action.payload.code;
        if(newLayoutCode) {
            return {
                ...state,
                currentView: {
                    code: newLayoutCode,
                    dataCode: action.payload.root
                }
            };
        }

    case SUBLAYOUT:

        return {
            ...state,
            sublayout: {
                ...state.sublayout,
                ...action.payload.items.reduce((existing, newSublayout) => {

                    let sublayoutCode = newSublayout.code;

                    existing[sublayoutCode] = {
                        ...state.sublayout[sublayoutCode],
                        ...newSublayout
                    };

                    return existing;

                }, {}),
            }
        };

    default:
      return state;
  }
}
