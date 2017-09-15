import { combineReducers } from 'redux';
import keycloak from 'reducers/keycloak.reducer';
import layouts from 'reducers/layouts.reducer';
import baseEntity from 'reducers/baseEntity.reducer';

export default combineReducers({
  keycloak,
  layouts,
  baseEntity
});
