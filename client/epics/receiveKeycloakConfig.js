import { RECEIVE_KEYCLOAK_CONFIG, INIT_VERTX } from 'constants/';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mapTo';

const receiveKeycloakConfig = action$ => {
  return action$
    .ofType( RECEIVE_KEYCLOAK_CONFIG )
    .mapTo({
      type: INIT_VERTX
    });
};

export default receiveKeycloakConfig;
