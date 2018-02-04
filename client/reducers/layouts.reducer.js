import layoutsIncluded from '../layouts-included';
import { LAYOUT_CHANGE, CMD_VIEW, SUB_LAYOUT, SUBLAYOUT_CHANGE, CMD_VIEW_PAGE_CHANGE } from 'constants';
import config from 'config/config';

const initialState = {
    current: config.backendLayouts ? null : 'layout1',
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
        loaded[action.payload.code] = JSON.parse(action.payload.data);
      }

      return {
        ...state,
        current: action.payload.code,
        currentSublayout: null,
        currentView: null,
        loaded
      };

    case CMD_VIEW_PAGE_CHANGE:
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
        const newSublayout = JSON.parse(action.payload.items);

        if(newSublayoutCode) {
            return {
                ...state,
                currentView: null,
                currentSublayout: {
                    code: newSublayoutCode,
                    root: action.payload.root,
                    layout: [newSublayout]
                }
            };
        }

    case SUB_LAYOUT:

        if(action.payload.items) {

            let newLayouts = {};

            action.payload.items.forEach(sublayout => {

                let sublayout_code = sublayout.code;
                let layout = JSON.parse(sublayout.data);

                if(sublayout_code && layout) {
                    newLayouts[sublayout_code] = {
                        layout: [layout]
                    };
                }
            });

            return {
                ...state,
                sublayout: {
                    ...state.sublayout,
                    ...newLayouts
                }
            };
        }

    default:
      return state;
  }
}
