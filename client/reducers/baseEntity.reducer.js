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
          ...state.data,
          [action.payload.id]: action.payload.params
        },
      };

    default:
      return state;
  }
}
