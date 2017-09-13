import { Observable } from 'rxjs/Observable';
import config from 'config/config';

class GennyBridge {
  ajaxCall( settings ) {
    return Observable.ajax({
      ...settings,
      responseType: 'json',
      timeout: 30000,
      url: `${config.genny.host}:${config.genny.bridge.port}/${settings.url}`,
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
}

export default ( new GennyBridge());
