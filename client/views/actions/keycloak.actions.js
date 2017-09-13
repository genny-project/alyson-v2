import { RECEIVE_KEYCLOAK_CONFIG, ERROR_RECEIVE_KEYCLOAK_CONFIG, AUTH_LOGGED_IN } from 'constants';

export const receiveKeycloakConfig = ({ response }) => ({
  type: RECEIVE_KEYCLOAK_CONFIG,
  payload: response,
});

export const errorReceiveKeycloakConfig = error => ({
  type: ERROR_RECEIVE_KEYCLOAK_CONFIG,
  payload: error,
});

export const authLoggedIn = token => ({
  type: AUTH_LOGGED_IN,
  payload: token,
});
