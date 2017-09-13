import {
  AUTH_LOGGED_IN,
  AUTH_LOGGED_OUT
} from 'constants';

const initialState = {
    authenticated: false,
};

export default function reducer( state = initialState, action ) {
  switch ( action.type ) {
    case AUTH_LOGGED_IN:
      return {
        ...state,
        authenticated: true
      };

    case AUTH_LOGGED_OUT:
      return {
        ...state,
        authenticated: false
      };

    default:
      return state;
  }
}
