import { BASE_ENTITY, BASE_ENTITY_DATA, ATTRIBUTE, ANSWER, EVT_LINK_CHANGE } from 'constants';
import { grabValue } from './utils.reducer';

const initialState = {
    data: {},
    relationships: {},
    aliases: {},
    attributes: [],
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
                    let parentCode = action.payload.parentCode;

                    if(action.payload.delete) {

                        delete state.data[baseEntityCode];
                        delete existing[baseEntityCode];
                        delete state.relationships[baseEntityCode];
                        Object.keys(state.relationships).forEach(relationshipKey => {

                            const relation = state.relationships[relationshipKey];
                            if(relation[baseEntityCode] != null) {
                              delete state.relationships[relationshipKey][baseEntityCode];
                            }
                        });

                        return {
                          ...state
                        }
                    }
                    else {

                        if(!newItem.baseEntityAttributes) {
                            existing[baseEntityCode] = {
                                ...state.data[baseEntityCode],
                                ...existing[baseEntityCode],
                                ...newItem,
                                parentCode: parentCode,
                                originalLinks: newItem.links,
                                links: newItem.links.reduce((existingLinks, newLink) => {

                                    let linkCode = newLink.link ? newLink.link.attributeCode : null;
                                    if(!linkCode) return [];

                                    if(!existingLinks[linkCode]) {
                                        existingLinks[linkCode] = [];
                                    }

                                    existingLinks[linkCode].push({
                                        ...newLink,
                                        targetCode: newLink.link.targetCode,
                                        linkValue: newLink.valueString || newLink.link.linkValue,
                                    });

                                    return existingLinks;

                                }, {}),
                                linkCode: action.payload.linkCode,
                                weight: newItem.weight ? newItem.weight : 1
                            };

                            return existing;
                        }

                        let existingAttributes = state.data[baseEntityCode] ? state.data[baseEntityCode].attributes : {};
                        if(newItem.baseEntityAttributes.length > 0) {

                            let newAttributes = newItem.baseEntityAttributes;
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
                        }

                        existing[baseEntityCode] = {
                            ...state.data[baseEntityCode],
                            ...existing[baseEntityCode],
                            ...newItem,
                            parentCode: parentCode,
                            originalLinks: newItem.links,
                            links: newItem.links.reduce((existingLinks, newLink) => {

                                let linkCode = newLink.link ? newLink.link.attributeCode : null;
                                if(!linkCode) return [];

                                if(!existingLinks[linkCode]) {
                                    existingLinks[linkCode] = [];
                                }

                                existingLinks[linkCode].push({
                                    ...newLink,
                                    targetCode: newLink.link.targetCode,
                                    linkValue: newLink.valueString || newLink.link.linkValue,
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
                attributes: action.payload.items,
            };

        case ANSWER:

        let newAnswers = action.payload.items;
        newAnswers.forEach(newAnswer => {

            let be_code = newAnswer.targetCode;
            let newValue = newAnswer.value;
            if(typeof newValue != 'string' ) { return; }

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

        case EVT_LINK_CHANGE:

        //TODO: use reduce to handle multiple link change
        if(action.payload.items.length > 0) {

            const item = action.payload.items[0];
            let be_code = item.targetCode;

            if(state.data[be_code] != null) {

                const oldParentCode = state.data[be_code].parentCode;
                const newParentCode = item.sourceCode;

                // if they are the same we just check that no GRP has the item still. can happen when we receive a BE message that HAS
                if(oldParentCode == newParentCode) {

                    Object.keys(state.data).forEach(beCode => {

                        // it is a GRP
                        if(beCode.startsWith("GRP_") && beCode != newParentCode) {

                            let be = state.data[beCode];

                            if(state.relationships[beCode] && state.relationships[beCode][be_code]) {
                                delete state.relationships[beCode][be_code];
                            }

                            if(be.links) {

                                // we check each link if they have the BE
                                Object.keys(be.links).forEach(linkKey => {

                                    let link = be.links[linkKey];
                                    link.forEach(linkedBe => {

                                        // we delete if found
                                        if(linkedBe.targetCode == be_code) {
                                            delete be.links[linkKey][be_code];
                                        }
                                    })
                                })
                            }

                            if(be.children && be.children.length > 0) {

                                for (var i = 0; i < be.children.length; i++) {

                                    const child = be.children[i];
                                    if(child && child.code == be_code) {
                                        delete be.children[i];
                                        i--;
                                    }
                                }
                            }
                        }
                    })

                    return {
                        ...state
                    }
                }
                else {

                    const newLinkCode = item.attributeCode;
                    const linkValue = item.linkValue;
                    const newLinkWeight = item.weight;

                    let newParentLinks = state.data[newParentCode] ? state.data[newParentCode].links : { [newLinkCode]: [] };

                    if(newParentLinks && newParentLinks[newLinkCode]) {

                        if(newParentLinks[newLinkCode].filter(x => x.targetCode == be_code).length == 0) {

                            newParentLinks = {
                                ...newParentLinks,
                                [newLinkCode]: [
                                    ...newParentLinks[newLinkCode],
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

                            if(newParentLinks[newLinkCode].length == 0) {
                                newParentLinks[newLinkCode] = [
                                    ...{
                                        value: linkValue,
                                        valueString: linkValue,
                                        weight: newLinkWeight,
                                        targetCode: be_code,
                                        linkValue: linkValue
                                    }
                                ]
                            }
                            else {

                                for(let i = 0; i < newParentLinks[newLinkCode].length; i++) {

                                    if(newParentLinks[newLinkCode][i].targetCode == be_code) {
                                        newParentLinks[newLinkCode][i] = {
                                            ...newParentLinks[newLinkCode][i],
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
                    }

                    if(state.relationships && state.relationships[oldParentCode]) {
                        delete state.relationships[oldParentCode][be_code];
                    }

                    if(state.data[oldParentCode] && state.data[oldParentCode].children) {
                        state.data[oldParentCode].children = state.data[oldParentCode].children.filter(child => child.code != be_code);
                    }

                    return {
                        ...state,
                        data: {
                            ...state.data,
                            [be_code]: {
                                ...state.data[be_code],
                                parentCode: newParentCode
                            },
                            [oldParentCode]: {
                                ...state.data[oldParentCode],
                                children: [
                                    ...((state.data[oldParentCode] && state.data[oldParentCode].children != null) ? state.data[oldParentCode].children.reduce((existing, child) => {
                                        if(child.code != be_code) existing.push(child);
                                        return existing;
                                    }, []) : [])
                                ],
                            },
                            [newParentCode]: {
                                ...state.data[newParentCode],
                                children: [
                                    ...((state.data[newParentCode] && state.data[newParentCode].children) ? state.data[newParentCode].children : []),
                                    {
                                        ...state.data[be_code],
                                    }
                                ],
                                links: newParentLinks
                            }
                        },
                        relationships: {
                            ...state.relationships,
                            [oldParentCode]: Object.keys(state.relationships[oldParentCode]).reduce((existing, key) => {

                                if (key != be_code) {
                                    existing[key] = state.relationships[oldParentCode][key];
                                }

                                return existing;

                            }, {}),
                            [newParentCode]: {
                                ...state.relationships[newParentCode],
                                [be_code]: { type: BASE_ENTITY, weight: newLinkWeight == 0 ? 0 : 1 }
                            },
                        }
                    };
                }
            }
        }

        return state;

        break;

        default:
        return state;
    }
}
