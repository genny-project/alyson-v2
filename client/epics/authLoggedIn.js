import { AUTH_LOGGED_IN, BRIDGE_SENT_AUTH_INIT } from 'constants/';
import { GennyBridge } from 'utils/genny';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

const authLoggedIn = action$ => {
  return action$
    .ofType(AUTH_LOGGED_IN)
    .do(action => GennyBridge.sendAuthInit(action.payload.token))
    .mapTo({
      type: BRIDGE_SENT_AUTH_INIT,
    });
};

export default authLoggedIn;
