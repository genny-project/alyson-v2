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
                    if(action.payload.delete) {

                        delete state.data[baseEntityCode];
                        delete existing[baseEntityCode];
                    }
                    else {

                        if(!newItem.baseEntityAttributes) {

                            existing[baseEntityCode] = {
                                ...state.data[baseEntityCode],
                                ...existing[baseEntityCode],
                                ...newItem,
                                originalLinks: newItem.links,
                                links: newItem.links.reduce((existingLinks, newLink) => {

                                    let linkCode = newLink.link ? newLink.link.attributeCode : null;
                                    if(!linkCode) return [];

                                    if(!existingLinks[linkCode]) {
                                        existingLinks[linkCode] = [];
                                    }

                                    existingLinks[linkCode].push({
                                        ...newLink,
                                        targetCode: newLink.pk.targetCode,
                                        linkValue: newLink.valueString,
                                    });

                                    return existingLinks;

                                }, {}),
                                linkCode: action.payload.linkCode,
                                weight: newItem.weight ? newItem.weight : 1
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
                            originalLinks: newItem.links,
                            links: newItem.links.reduce((existingLinks, newLink) => {

                                let linkCode = newLink.link ? newLink.link.attributeCode : null;
                                if(!linkCode) return [];

                                if(!existingLinks[linkCode]) {
                                    existingLinks[linkCode] = [];
                                }

                                existingLinks[linkCode].push({
                                    ...newLink,
                                    targetCode: newLink.pk.targetCode,
                                    linkValue: newLink.valueString,
                                });

                                return existingLinks;

                            }, {}),

                            linkCode: action.payload.linkCode,
                            attributes: existingAttributes,
                            weight: newItem.weight ? newItem.weight : 1,
                        };

                        delete existing[baseEntityCode].baseEntityAttributes;
                    }

                    return existing;

                }, {}),
            },
            relationships: {
                ...state.relationships,
                [action.payload.parentCode]: {
                    ...state.relationships[action.payload.parentCode],
                    ...action.payload.items.reduce((existingItem, newItem) => {

                        existingItem[newItem.code] = !action.payload.delete ? { type: BASE_ENTITY, weight: newItem.weight == 0 ? 0 : 1 } : false;

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

                if(action.payload.delete) {

                    if(state.data[be_code] && state.data[be_code].attributes) {
                        delete state.data[be_code].attributes[attributeCode];
                    }
                }
                else {

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
                        attributeCode: attributeCode
                    };
                }
            }
        });

        return {
            ...state
        };

        case LINK_CHANGE:

        action.payload.items.forEach(item => {

            let be_code = item.targetCode;

            // it means we dont have this base entity locally
            if(!state.data[be_code]) { return; }

            let oldParentCode = state.data[be_code].parentCode;
            let newParentCode = item.sourceCode;
            let newLinkCode = item.attributeCode;
            let linkValue = item.linkValue;
            let newLinkWeight = item.weight;

            let relationshipObject = {
                ...state.relationships[oldParentCode]
            };

            delete relationshipObject[be_code];
            delete state.relationships[oldParentCode];


            state.relationships[oldParentCode] = relationshipObject; // delete the old relationship
            state.relationships[newParentCode] = {  // create the new relationship
                ...state.relationships[newParentCode],
                [be_code]: { type: BASE_ENTITY, weight: newLinkWeight == 0 ? 0 : 1 }
            };

            if(state.data[be_code]) {
                state.data[be_code].parentCode = newParentCode; // set new parent
            }

            if(state.data[oldParentCode] && state.data[oldParentCode].children.length > 0) {
                for (var i = 0; i < state.data[oldParentCode].children.length; i++) {
                    if(state.data[oldParentCode].children[i].code == be_code) {
                        delete state.data[oldParentCode].children[i];
                    }
                }
            }

            // if(!state.data[newParentCode]) {
            //     state.data[newParentCode] = {
            //         children: []
            //     };
            // }

            state.data[newParentCode] = {
                ...state.data[newParentCode],
                children: [
                    ...(state.data[newParentCode] ? state.data[newParentCode].children : {}),
                    state.data[be_code], // add be as new children of target code
                ]
            };

            if(state.data[newParentCode].links && state.data[newParentCode].links[newLinkCode]) {

                if(state.data[newParentCode].links[newLinkCode].filter(x => x.targetCode == be_code).length == 0) {

                    state.data[newParentCode].links = {
                        ...state.data[newParentCode].links,
                        [newLinkCode]: [
                            ...state.data[newParentCode].links[newLinkCode],
                            {
                                value: linkValue,
                                valueString: linkValue,
                                weight: newLinkWeight,
                                targetCode: be_code,
                                linkValue: linkValue
                            }
                        ]
                    };
                }
                else {

                    let links = state.data[newParentCode].links[newLinkCode];
                    for(let i = 0; i < links.length; i++) {

                        if(links[i].targetCode == be_code) {
                            links[i] = {
                                ...links[i],
                                ...{
                                    value: linkValue,
                                    valueString: linkValue,
                                    weight: newLinkWeight,
                                    targetCode: be_code,
                                    linkValue: linkValue
                                }
                            };
                        }
                    }
                }
            }
        });

        return {
            ...state
        };

        default:
        return state;
    }
}
