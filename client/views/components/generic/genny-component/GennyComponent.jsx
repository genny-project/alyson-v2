import React, { Component } from 'react';
import { GennyBridge } from 'utils/genny';

class GennyComponent extends Component {

    sendCode(code) {
        GennyBridge.sendCode("GRP_CONTACTS");
    }
}


export default GennyComponent;
