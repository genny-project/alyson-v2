import React, { Component } from 'react';
import { GennyBridge } from 'utils/genny';

class GennyComponent extends Component {

    sendMessage(data) {
        console.log(data);
        GennyBridge.sendMessage('GRP_CONTACTS');
    }
}

export default GennyComponent;
