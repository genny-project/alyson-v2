import { combineReducers } from 'redux';
import keycloak from 'reducers/keycloak.reducer';
import layouts from 'reducers/layouts.reducer';
import baseEntity from 'reducers/baseEntity.reducer';
import app from 'reducers/app.reducer';

export default combineReducers({
  keycloak,
  layouts,
  baseEntity,
  app
});
