import {
  AUTH_LOGGED_IN,
  AUTH_LOGGED_OUT,
  RECEIVE_KEYCLOAK_CONFIG
} from 'constants';

const initialState = {
    authenticated: false,
    config: null,
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

    case RECEIVE_KEYCLOAK_CONFIG:
      return {
        ...state,
        config: action.payload,
      };

    default:
      return state;
  }
}
