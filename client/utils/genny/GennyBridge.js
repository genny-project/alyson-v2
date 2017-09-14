import { Observable } from 'rxjs/Observable';
import config from 'config/config';
import { Vertx } from './';
import { authInit } from './vertx-events/auth.events';

class GennyBridge {
  ajaxCall( settings ) {
    return Observable.ajax({
      ...settings,
      responseType: 'json',
      timeout: 30000,
      url: `${config.genny.host}/${settings.url}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  getKeycloakConfig() {
    return this.ajaxCall({
      url: `${config.genny.bridge.endpoints.events}/init?url=${window.location.origin}`,
    });
  }

  initVertx( url ) {
    Vertx.init( url );
  }

  sendAuthInit( token ) {
    Vertx.sendMessage( authInit( token ));
  }
}

export default ( new GennyBridge());
