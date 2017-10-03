import { BASE_ENTITY } from 'constants';

const initialState = {
  data: {},
  relationships: {}
};

export default function reducer( state = initialState, action ) {

  switch ( action.type ) {
    case BASE_ENTITY:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload.items.reduce(( existing, item ) => {
            existing[item.code] = {
              ...state.data[item.code],
              data: {
                ...(state.data[item.code] ? state.data[item.code].data : {}),
                ...item
              },
            };

            return existing;

          }, {}),
        },
        relationships: {
          ...state.relationships,
          [action.payload.parentCode]: {
             ...state.relationships[action.payload.parentCode],
             ...action.payload.items.reduce(( existingItem, newItem ) => {
              existingItem[newItem.code] = !action.payload.delete ? { type: BASE_ENTITY } : false;
              return existingItem;
            }, {})
          }
        }
      };

    default:
      return state;
  }
}
