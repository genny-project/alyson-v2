import { combineReducers } from 'redux';
import keycloak from 'reducers/keycloak.reducer';
import layouts from 'reducers/layouts.reducer';

export default combineReducers({
  keycloak,
  layouts
});
