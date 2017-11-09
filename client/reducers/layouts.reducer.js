import layoutsIncluded from '../layouts-included';
import { LAYOUT_CHANGE, CMD_VIEW, SUBLAYOUT, SUBLAYOUT_CHANGE } from 'constants';
import config from 'config/config';

const initialState = {
    current: config.backendLayouts ? null : "layout1",
    loaded: {
      ...layoutsIncluded,
    },
    sublayout: {},
    currentView: null,
    currentSublayout: null
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
                },
                currentSublayout: null
            };
        }

    case SUBLAYOUT_CHANGE:

        const newSublayoutCode = action.payload.code;
        const newSublayout = action.payload.layout;
        if(newSublayoutCode) {
            return {
                ...state,
                currentView: null,
                currentSublayout: {
                    code: newSublayoutCode,
                    layout: newSublayout
                }
            }
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
