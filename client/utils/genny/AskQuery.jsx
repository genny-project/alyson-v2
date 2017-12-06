import React, { Component } from 'react';
import store from 'views/store';

class AskQuery {

    static getAsksFromGroup(groupCode) {

        const group = store.getState().ask[groupCode];
        return group;
    }

}

export default AskQuery;
