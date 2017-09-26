import React, { Component } from 'react';
import { GennyBridge } from 'utils/genny';

class GennyData extends Component {

    sendCode(code) {
        GennyBridge.sendCode("GRP_CONTACTS");
    }
}

export default GennyData;
