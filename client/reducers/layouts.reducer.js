import layoutsIncluded from '../layouts-included';
import { LAYOUT_CHANGE, CMD_VIEW, SUB_LAYOUT, SUBLAYOUT_CHANGE } from 'constants';
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
         current: action.payload.code,
        };
      }

      if (action.payload.data) {
        loaded[action.payload.code] = action.payload.data;
      }

      return {
        ...state,
        current: action.payload.code,
        currentSublayout: null,
        currentView: null,
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
        const newSublayout = action.payload.items;
        if(newSublayoutCode) {
            return {
                ...state,
                currentView: null,
                currentSublayout: {
                    code: newSublayoutCode,
                    root: action.payload.root,
                    layout: [newSublayout]
                }
            }
        }

    case SUB_LAYOUT:

        let sublayout_code = action.payload.code;
        let layout = action.payload.items;
        if(sublayout_code && layout) {
            return {
                ...state,
                sublayout: {
                    ...state.sublayout,
                    [sublayout_code]: {
                        layout: [layout]
                    }
                }
            };
        }

    default:
      return state;
  }
}
