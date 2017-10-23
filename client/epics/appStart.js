import { Observable } from 'rxjs/Observable';
import { receiveKeycloakConfig, errorReceiveKeycloakConfig } from 'views/actions/keycloak.actions.js';
import { APP_START } from 'constants/';
import { GennyBridge } from 'utils/genny';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

const appStart = action$ => {
  return action$
    .ofType( APP_START )
    .mergeMap(() =>
      GennyBridge.getKeycloakConfig().map( receiveKeycloakConfig ).catch( error => Observable.of( errorReceiveKeycloakConfig( error )))
    );
};

export default appStart;
