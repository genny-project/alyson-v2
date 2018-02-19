import store from 'views/store';

class AskQuery {

    static getQuestionGroup(groupCode) {
        return store.getState().ask.data[groupCode];
    }

    static recursivelyGetAsksForGroup(group) {
        return group.childAsks.map(ask => {

            console.log(ask);
            if(ask.attributeCode.includes("EMPTY")) return false;
            return ask.childAsks ? AskQuery.recursivelyGetAsksForGroup(ask) : ask;
        });
    }
}

export default AskQuery;
