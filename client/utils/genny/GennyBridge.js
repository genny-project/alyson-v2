import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/dom/ajax';
import config from 'config/config';
import { Vertx, MessageHandler } from './vertx';
import events from './vertx-events';
import store from 'views/store';
import { ATTRIBUTE } from './../../constants';

class GennyBridge {

  getToken() {
    const token = store.getState().keycloak.token;
    return token;
  }

  sendMessage(event, data) {
    let token = this.getToken();
    Vertx.sendMessage(events.outgoing.SEND_CODE(event, data, token));
  }

  sendTVEvent(event, data) {
    let token = this.getToken();
    Vertx.sendMessage(events.outgoing.TV_EVENT(event, data, token));
  }

  sendLogout(event, data) {
    let token = this.getToken();
    Vertx.sendMessage(events.outgoing.LOGOUT(event, data, token));
  }

  sendAnswer(data, items) {
    let token = this.getToken();
    Vertx.sendMessage(events.outgoing.ANSWER(data, items, token));

    //TODO: remove this. Temporary only.
    // send response to front with the updated attribute

    let message = {
      msg_type : "DATA_MSG",
      data_type : ATTRIBUTE,
      items: items
  };

    this.messageHandler.onMessage(message);
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
