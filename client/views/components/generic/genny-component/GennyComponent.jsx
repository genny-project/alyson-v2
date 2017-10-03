import React, { Component } from 'react';
import { GennyBridge } from 'utils/genny';
import store from 'views/store';

class GennyComponent extends Component {

    constructor(props) {
        super(props);

        store.subscribe(() => {
            this.didReceiveDataFromStore(store.getState());
        }).bind(this);
    }

    didReceiveDataFromStore(data) {
        console.log('Method was not implemented.');
    }

    sendData(event, data) {

        const token = store.getState().keycloak.token;
        GennyBridge.sendMessage(event, data, token);
    }
}

export default GennyComponent;
