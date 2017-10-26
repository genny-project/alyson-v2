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

    // sending back the data to the front end as the backend is not doing it for now.
    // test was made for color picker.
    // this.messageHandler.onMessage({
    //     data_type: "BaseEntity",
    //     delete: false,
    //     aliasCode: "PROJECT",
    //     items: [
    //         {
    //             code: items[0].targetCode || "PER_USER1",
    //             name: "PROJECT",
    //             baseEntityAttributes: [
    //                 {
    //                     baseEntityCode: items[0].targetCode,
    //                     attributeCode: "PRIMARY_COLOR",
    //                     valueString: items[0].value
    //                 }
    //             ]
    //         }
    //     ],
    //     msg_type: "DATA_MSG"
    // });
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

    // TODO: to be removed
    this.messageHandler.onMessage({
        data_type: "BaseEntity",
        delete: false,
        aliasCode: "PROJECT",
        items: [
            {
                code: "PROJECT",
                name: "PROJECT",
                baseEntityAttributes: [
                    {
                        baseEntityCode: "PROJECT",
                        attributeCode: "PRIMARY_COLOR",
                        valueString: "#000"
                    }
                ]
            }
        ],
        msg_type: "DATA_MSG"
    });
  }

  sendAuthInit(token) {
    Vertx.sendMessage(events.outgoing.AUTH_INIT(token));
  }
}

export default (new GennyBridge());
