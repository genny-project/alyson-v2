import React, { Component } from 'react';
import store from 'views/store';

class AskQuery {

    static getQuestionGroup(groupCode) {
        return store.getState().ask.data[groupCode];
    }
    
    static recursivelyGetAsksForGroup(group) {

        return group.childAsks.map(ask => {

            if(ask.childAsks) {
                return AskQuery.getAsksForGroup(ask);
            }

            return ask;
        });
    }
}

export default AskQuery;
