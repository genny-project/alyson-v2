import { Observable } from 'rxjs/Observable';
import config from 'config/config';
import { Vertx, MessageHandler } from './vertx';
import events from './vertx-events';

class GennyBridge {

  sendMessage(event, data, token) {
    Vertx.sendMessage(events.outgoing.SEND_CODE(event, data, token));
  }

  sendTVExpand(event, data) {
    Vertx.sendMessage(events.outgoing.TV_EXPAND(event, data));
  }

  ajaxCall(settings) {
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

  initVertx(url) {

    /* Create a new message handler */
    this.messageHandler = new MessageHandler();

    /* Set vertx to use the message handler */
    Vertx.setIncomingHandler(this.messageHandler.onMessage);

    /* Init vertx */
    Vertx.init(url);

    /* Allow incoming messages to be sent from the browser console */
    window.sendIncomingVertxMessage = (message) => {
      this.messageHandler.onMessage(message);
    };
  }

  sendAuthInit(token) {
    Vertx.sendMessage(events.outgoing.AUTH_INIT(token));
  }
}

export default (new GennyBridge());
