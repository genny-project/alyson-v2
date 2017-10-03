import { BASE_ENTITY } from 'constants';

const initialState = {
    data: {},
};

export default function reducer( state = initialState, action ) {

  switch ( action.type ) {
    case BASE_ENTITY:
      const entities = ( action.payload.length ) ? action.payload : [ action.payload ];
      return {
        ...state,
        data: {
          ...state.data,
          ...entities.reduce(( existing, item ) => ({
            ...existing,
            [item.code]: item
          }), {})
        },
      };

    default:
      return state;
  }
}
