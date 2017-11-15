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
    if(token)
    Vertx.sendMessage(events.outgoing.SEND_CODE(event, data, token));
  }

  sendBtnClick(data) {

      let token = this.getToken();
      if(token) {
          Vertx.sendMessage(events.outgoing.BTN(data, token));
      }
  }

  sendTVEvent(event, data) {

    let token = this.getToken();
    if(token)
        Vertx.sendMessage(events.outgoing.TV_EVENT(event, data, token));

  }

  sendLogout(event, data) {
    let token = this.getToken();
    if(token)
        Vertx.sendMessage(events.outgoing.LOGOUT(event, data, token));
  }

  sendBucketDropEvent(data) {

      let token = this.getToken();
      if(token) {
          console.log("sending");console.log(data);
          Vertx.sendMessage(events.outgoing.BUCKET_DROP_EVENT(data, token));
      }
  }

  sendAnswer(items) {
    let token = this.getToken();
    if(token) {

        let answers = items.map(item => {

            if(!item.sourceCode) {
                item.sourceCode = store.getState().baseEntity.aliases["USER"];
            }

            return item;
        });

        Vertx.sendMessage(events.outgoing.ANSWER('Answer', answers, token));

    }

    let payload = {

        data_type: "Attribute",
        delete: false,
        items: [
            {
                baseEntityCode: items[0].targetCode,
                targetCode: items[0].targetCode,
                value: items[0].value,
                attributeCode: items[0].attributeCode
            }
        ],
        msg_type: "DATA_MSG"
    };

    // locally updating the attribute so we dont have to wait for the backend to send us an answer. this is called optimistic results.
    // this.messageHandler.onMessage(payload);
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
