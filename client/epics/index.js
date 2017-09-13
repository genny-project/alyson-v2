import 'rxjs';
import { combineEpics } from 'redux-observable';
import appStart from './appStart';
import authLoggedIn from './authLoggedIn';
import receiveKeycloakConfig from './receiveKeycloakConfig';

export default combineEpics(
  appStart,
  authLoggedIn,
  receiveKeycloakConfig
);
