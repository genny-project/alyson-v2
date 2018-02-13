import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/dom/ajax';
import config from 'config/config';
import { Vertx, MessageHandler } from './vertx';
import events from './vertx-events';
import store from 'views/store';
import { ATTRIBUTE } from 'constants';
import axios from 'axios';
import decode_token from 'jwt-decode';

class GennyBridge {

    getToken() {
        const token = store.getState().keycloak.token;
        return token;
    }

    getUser() {
        return store.getState().baseEntity.aliases["USER"];
    }

    getProject() {
        return store.getState().baseEntity.aliases["PROJECT"];
    }

    getKeycloakRoles() {

        const token = this.getToken();
        const session_data = decode_token(token);
        if(session_data && session_data.realm_access && session_data.realm_access.roles) {
            return session_data.realm_access.roles;
        }

        return [];
    }

    sendMessage(event, data) {
        let token = this.getToken();
        if(token)
        Vertx.sendMessage(events.outgoing.SEND_CODE(event, data, token));
    }

    sendBtnClick(event_type, data) {

        let token = this.getToken();
        if(token) {
            Vertx.sendMessage(events.outgoing.BTN(event_type, data, token));
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
            Vertx.sendMessage(events.outgoing.BUCKET_DROP_EVENT(data, token));
        }
    }

    sendGPSData(data) {

        let token = this.getToken();
        if(token) {

            let final = data.map(item => {
                return item.coords;
            });

            Vertx.sendMessage(events.outgoing.ANSWER('GPS', final, token));
        }
    }

    sendGeofenceData(event_id, data) {

        let token = this.getToken();
        if(token) {
            Vertx.sendMessage(events.outgoing.GEOFENCE_NOTIFICATION(event_id, data, token));
        }
    }

    sendCacheMissing(beCode) {

        let token = this.getToken();
        if(token) {
            Vertx.sendMessage(events.outgoing.CACHE_MISSING(token, beCode));
        }
    }

    sendAnswer = (items) => {

        let token = this.getToken();
        if(token) {

            let answers = items.map(item => {

                if(!item.sourceCode) {
                    item.sourceCode = this.getUser();
                }

                return item;
            });

            Vertx.sendMessage(events.outgoing.ANSWER('Answer', answers, token));
        }

        if(items[0].attributeCode.includes('ADDRESS_FULL')) { return; }

        let value = items[0].value;
        if(items[0].attributeCode.includes('PRICE')) {
            value = JSON.parse(value).amount;
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
        GennyBridge.messageHandler.onMessage(payload);
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
            url: `${config.genny.bridge.endpoints.events}/init?url=${( process.env.NODE_ENV !== 'production' ) ? 'http://localhost:3000' : process.env.FORCE_REACT_ORIGIN || window.location.origin}`,
        });
    }

    static initVertx(token, url) {

        console.log("[Vertx] Opening Vertx...");

    /* Create a new message handler */
        this.messageHandler = new MessageHandler();

        /* Set vertx to use the message handler */
        Vertx.setIncomingHandler(this.messageHandler.onMessage);

        /* Init vertx */
        Vertx.init(token, url);

        /* Allow incoming messages to be sent from the browser console */
        window.sendIncomingVertxMessage = (message) => {
            this.messageHandler.onMessage(message);
        };
    }

    sendAuthInit(token) {

        let keycloakConfig = store.getState().keycloak.config;
        if(keycloakConfig) {

            axios.post(`${config.genny.host}/${config.genny.bridge.endpoints.events}/init?url=hello}`, {
                responseType: 'json',
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + this.getToken()
                },
            })
            .then(() => {
                GennyBridge.initVertx(token, keycloakConfig.vertx_url);

                let social_code = window.getQueryString('code');
                if(social_code && localStorage.getItem("socialredirect")) {  // we are coming back from a redirect.
                    // Vertx.sendMessage(events.outgoing.REDIRECT_RETURN(token));
                    Vertx.sendMessage(events.outgoing.AUTH_INIT(token));
                }
                else {
                    Vertx.sendMessage(events.outgoing.AUTH_INIT(token));
                }

            }).catch(err => console.error(err));
        }
    }
}

export default (new GennyBridge());
