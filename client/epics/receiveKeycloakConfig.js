import { RECEIVE_KEYCLOAK_CONFIG, INIT_VERTX } from 'constants/';
import { GennyBridge } from 'utils/genny';

const receiveKeycloakConfig = action$ => {
  return action$
    .ofType( RECEIVE_KEYCLOAK_CONFIG )
    .do( action => GennyBridge.initVertx( action.payload.vertx_url ))
    .mapTo({
      type: INIT_VERTX
    });
};

export default receiveKeycloakConfig;
