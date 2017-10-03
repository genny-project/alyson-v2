import { BASE_ENTITY } from 'constants';

const initialState = {
  data: {},
};

export default function reducer( state = initialState, action ) {

  switch ( action.type ) {
    case BASE_ENTITY:
      return {
        ...state,
        data: {
          ...state.entities,
          ...action.payload.items.reduce(( existing, item ) => {
            existing[item.code] = {
              ...state.entities[item.code],
              data: {
                ...state.entities[item.code].data,
                ...item
              },
              relationships: {
                ...state.entities[item.code].relationships,
                ...action.payload.items.reduce(( existing, item ) => {
                  existing[item.code] = !action.payload.delete;
                }, {})
              }
            };
          }, {})
        }
      };

    default:
      return state;
  }
}
