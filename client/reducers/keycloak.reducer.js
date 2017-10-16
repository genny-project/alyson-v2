import {
  AUTH_LOGGED_IN,
  AUTH_LOGGED_OUT,
  RECEIVE_KEYCLOAK_CONFIG,
  LOGOUT,
  ACCOUNTS
} from 'constants';

const initialState = {
    authenticated: false,
    config: null,
    token: null,
    logout: false,
    accounts: false,
};

export default function reducer( state = initialState, action ) {
  switch ( action.type ) {
    case AUTH_LOGGED_IN:
      return {
        ...state,
        authenticated: true,
        token: action.payload.token,
      };

    case AUTH_LOGGED_OUT:
      return {
        ...state,
        authenticated: false,
        token: null,
      };

    case RECEIVE_KEYCLOAK_CONFIG:
      return {
        ...state,
        config: action.payload,
      };

    case LOGOUT:
      return {
        ...state,
        logout: true
      };

      case ACCOUNTS:
      return {
        ...state,
        accounts: true
      };

    default:
      return state;
  }
}
