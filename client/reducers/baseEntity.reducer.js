import { BASE_ENTITY, BASE_ENTITY_DATA, ATTRIBUTE, ANSWER, LINK_CHANGE } from 'constants';
import { grabValue } from './utils.reducer';

const initialState = {
    data: {},
    relationships: {},
    aliases: {}
};

export default function reducer(state = initialState, action) {

    switch (action.type) {

        case BASE_ENTITY:
        case BASE_ENTITY_DATA:

        return {
            ...state,
            data: {
                ...state.data,
                ...action.payload.items.reduce((existing, newItem) => {

                    let baseEntityCode = newItem.code;

                    if(!newItem.baseEntityAttributes) {

                        existing[baseEntityCode] = {
                            ...state.data[baseEntityCode],
                            ...existing[baseEntityCode],
                            ...newItem,
                            linkCode: action.payload.linkCode,
                        };

                        return existing;
                    }

                    let newAttributes = newItem.baseEntityAttributes;
                    let existingAttributes = (existing[baseEntityCode] ? existing[baseEntityCode].attributes : {});

                    newAttributes.forEach(newAttribute => {

                        existingAttributes[newAttribute.attributeCode] = {
                            ...existingAttributes[newAttribute.attributeCode],
                            ...newAttribute,
                            ... {
                                value: grabValue(newAttribute),
                                baseEntityCode: baseEntityCode
                            }
                        };
                    });

                    existing[baseEntityCode] = {
                        ...state.data[baseEntityCode],
                        ...existing[baseEntityCode],
                        ...newItem,
                        linkCode: action.payload.linkCode,
                        attributes: existingAttributes
                    };

                    delete existing[baseEntityCode].baseEntityAttributes;
                    return existing;

                }, {}),
            },
            relationships: {
                ...state.relationships,
                [action.payload.parentCode]: {
                    ...state.relationships[action.payload.parentCode],
                    ...action.payload.items.reduce((existingItem, newItem) => {

                        existingItem[newItem.code] = !action.payload.delete ? { type: BASE_ENTITY } : false;

                        return existingItem;
                    }, {})
                }
            },
            aliases: {
                ...state.aliases,
                ...action.payload.items.reduce((existing, newItem) => {

                    if(action.payload.aliasCode) {
                        existing[action.payload.aliasCode] = newItem.code;
                    }

                    return existing;

                }, {})
            }
        };

        case ATTRIBUTE:

        return {
            ...state,
            data: {
                ...state.data,
                ...action.payload.items.forEach((attribute) => {

                    let be_code = attribute.targetCode;
                    let attributeCode = attribute.attributeCode;
                    let newValue = attribute.value;

                    if(!state.data[be_code])  {

                        state.data[be_code] = {
                            attributes: {}
                        };
                    }

                    if(!state.data[be_code].attributes) {
                        state.data[be_code].attributes = {};
                    }

                    let found = false;
                    if(Object.keys(state.data[be_code].attributes).length > 0) {
                        Object.keys(state.data[be_code].attributes).forEach(attribute_key => {

                            if(attribute_key == attributeCode) {
                                state.data[be_code].attributes[attribute_key].value = newValue;
                                found = true;
                            }
                        });
                    }

                    if(!found) {

                        state.data[be_code] = {
                            ...state.data[be_code],
                            ...state.data[be_code].attributes[attributeCode] = {
                                ...(state.data[be_code] ? state.data[be_code].attributes[attributeCode] : {}),
                                ...{
                                    code: attributeCode,
                                    value: newValue
                                }
                            }
                        };
                    }
                }),
            }
        };

        case ANSWER:

        let newAnswers = action.payload.items;
        newAnswers.forEach(newAnswer => {

            let be_code = newAnswer.targetCode;
            let attributeCode = newAnswer.attributeCode;
            if(be_code && attributeCode) {

                let newAtt = {
                    code: attributeCode,
                    value: newAnswer.value,
                    baseEntityCode: be_code,
                    created: newAnswer.created,
                    updated: newAnswer.updated,
                    weight: newAnswer.weight,
                    inferred: newAnswer.inferred,
                    refused: newAnswer.refused,
                };

                if(newAnswer.name) {
                    newAtt.name = newAnswer.name;
                }

                if(!state.data[be_code])  {
                    state.data[be_code] = {
                        attributes: {}
                    };
                }

                if(!state.data[be_code].attributes) {
                    state.data[be_code].attributes = {};
                }

                state.data[be_code].attributes[attributeCode] = {
                    ...state.data[be_code].attributes[attributeCode],
                    value: newAtt.value,
                    attribute: {
                        ...(state.data[be_code].attributes[attributeCode] ? state.data[be_code].attributes[attributeCode].attribute : {}),
                        ...newAtt,
                    },
                    weight: newAtt.weight,
                    inferred: newAtt.inferred,
                };
            }
        });

        return {
            ...state
        }

        case LINK_CHANGE:

        action.payload.items.forEach(item => {

            let be_code = item.targetCode;
            let oldParentCode = state.data[be_code].parentCode;
            let newParentCode = item.sourceCode;

            let relationshipObject = {
                ...state.relationships[oldParentCode]
            };

            delete relationshipObject[be_code];

            state.relationships[oldParentCode] = relationshipObject; // delete the old relationship
            state.relationships[newParentCode] = {  // create the new relationship
                ...state.relationships[newParentCode],
                [be_code]: { type: BASE_ENTITY }
            };

            if(state.data[be_code]) {
                state.data[be_code].parentCode = newParentCode; // set new parent
            }

            if(state.data[oldParentCode] && state.data[oldParentCode].children.length > 0) {
                state.data[oldParentCode].children = state.data[oldParentCode].children.filter(child => { // remove be from old parent's children
                    return child.code != be_code;
                });
            }

            // if(!state.data[newParentCode]) {
            //     state.data[newParentCode] = {
            //         children: []
            //     };
            // }

            state.data[newParentCode] = {
                ...state.data[newParentCode],
                children: [
                    ...state.data[newParentCode].children,
                    state.data[be_code], // add be as new children of target code
                ]
            };
        });

        return {
            ...state
        };

        default:
        return state;
    }
}
