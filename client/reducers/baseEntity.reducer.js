import { BASE_ENTITY, BASE_ENTITY_DATA, ATTRIBUTE, ANSWER, EVT_LINK_CHANGE } from 'constants';
import { grabValue } from './utils.reducer';

const initialState = {
    data: {},
    relationships: {},
    aliases: {},
    attributes: [],
};

const handleBaseEntity = (state, action, existing, newItem) => {

    let baseEntityCode = newItem.code;
    let parentCode = action.payload.parentCode;

    if (action.payload.delete === true) {

        delete state.data[baseEntityCode];
        delete existing[baseEntityCode];
        delete state.relationships[baseEntityCode];
        Object.keys(state.relationships).forEach(relationshipKey => {

            const relation = state.relationships[relationshipKey];
            if (relation[baseEntityCode] != null) {
                delete state.relationships[relationshipKey][baseEntityCode];
            }
        });

    } else {

        if (!newItem.baseEntityAttributes) {

            existing[baseEntityCode] = {
                ...state.data[baseEntityCode],
                ...existing[baseEntityCode],
                ...newItem,
                parentCode: parentCode,
                originalLinks: newItem.links,
                links: newItem.links.reduce((existingLinks, newLink) => {

                    let linkCode = newLink.link ? newLink.link.attributeCode : null;
                    if (!linkCode) return [];

                    if (!existingLinks[linkCode]) {
                        existingLinks[linkCode] = [];
                        existingLinks[linkCode].push({
                            ...newLink,
                            targetCode: newLink.link.targetCode,
                            linkValue: newLink.valueString || newLink.link.linkValue,
                        });
                    } else {

                        let found = -1;
                        for (let index = 0; index < existingLinks[linkCode].length; index++) {
                            const link = existingLinks[linkCode][index];
                            if (link != null && link.link != null && link.link.targetCode != null && link.link.targetCode == newLink.link.targetCode) {
                                found = index;
                                break;
                            }
                        }

                        if (found > -1) {
                            existingLinks[linkCode][found] = {
                                ...existingLinks[linkCode][found],
                                ...newLink,
                                targetCode: newLink.link.targetCode,
                                linkValue: newLink.valueString || newLink.link.linkValue,
                            };
                        } else {

                            existingLinks[linkCode].push({
                                ...newLink,
                                targetCode: newLink.link.targetCode,
                                linkValue: newLink.valueString || newLink.link.linkValue,
                            });
                        }
                    }

                    return existingLinks;

                }, (state.data[baseEntityCode] && state.data[baseEntityCode].links ? state.data[baseEntityCode].links : {})),
                linkCode: action.payload.linkCode,
                weight: newItem.weight ? newItem.weight : 1
            };

            return existing;
        }

        let existingAttributes = (state.data[baseEntityCode] && state.data[baseEntityCode].attributes != null) ? state.data[baseEntityCode].attributes : {};
        if (newItem.baseEntityAttributes.length > 0) {

            let newAttributes = newItem.baseEntityAttributes;
            newAttributes.forEach(newAttribute => {

                if (newAttribute.privacyFlag == false || newAttribute.privacyFlag == null) {

                    existingAttributes[newAttribute.attributeCode] = {
                        ...existingAttributes[newAttribute.attributeCode],
                        ...newAttribute,
                        ... {
                            value: grabValue(newAttribute),
                            baseEntityCode: baseEntityCode
                        }
                    };
                }
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
                if (!linkCode) return [];

                if (!existingLinks[linkCode]) {
                    existingLinks[linkCode] = [];
                    existingLinks[linkCode].push({
                        ...newLink,
                        targetCode: newLink.link.targetCode,
                        linkValue: newLink.valueString || newLink.link.linkValue,
                    });
                } else {

                    let found = -1;
                    for (let index = 0; index < existingLinks[linkCode].length; index++) {
                        const link = existingLinks[linkCode][index];
                        if (link != null && link.link != null && link.link.targetCode != null && link.link.targetCode == newLink.link.targetCode) {
                            found = index;
                            break;
                        }
                    }

                    if (found > -1) {

                        existingLinks[linkCode][found] = {
                            ...existingLinks[linkCode][found],
                            ...newLink,
                            targetCode: newLink.link.targetCode,
                            linkValue: newLink.valueString || newLink.link.linkValue,
                        };
                    } else {

                        existingLinks[linkCode].push({
                            ...newLink,
                            targetCode: newLink.link.targetCode,
                            linkValue: newLink.valueString || newLink.link.linkValue,
                        });
                    }
                }

                return existingLinks;

            }, (state.data[baseEntityCode] && state.data[baseEntityCode].links ? state.data[baseEntityCode].links : {})),
            linkCode: action.payload.linkCode,
            attributes: existingAttributes,
            weight: newItem.weight ? newItem.weight : 1,
        };

        delete existing[baseEntityCode].baseEntityAttributes;
    }
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
                        handleBaseEntity(state, action, existing, newItem);
                        return existing;

                    }, {}),
                    ...(
                        action.payload.parentCode && state.data[action.payload.parentCode] == null ? ({
                            [action.payload.parentCode]: {
                                ...state.data[action.payload.parentCode],
                                children: [
                                    ...(state.data[action.payload.parentCode] != null ? state.data[action.payload.parentCode].children : []),
                                    ...action.payload.items.map((item, index) => {

                                        if (item.code != null) {
                                            return state.data[item.code] ? state.data[item.code] : {
                                                code: item.code
                                            };
                                        }

                                        return false;
                                    })
                                ],
                                links: {
                                    ...(state.data[action.payload.parentCode] != null ? state.data[action.payload.parentCode].links : {}),
                                    ...action.payload.items.reduce((existing, newItem) => {

                                        if (newItem.code != null) {

                                            if (existing["LNK_CORE"] == null) {
                                                existing["LNK_CORE"] = [
                                                    ...(state.data[action.payload.parentCode] != null && state.data[action.payload.parentCode].links != null ? state.data[action.payload.parentCode].links["LNK_CORE"] : []),
                                                ];
                                            }

                                            existing["LNK_CORE"] = [
                                                ...existing["LNK_CORE"],
                                                ...[{
                                                    attributeCode: "LINK",
                                                    weight: 1,
                                                    targetCode: newItem.code,
                                                    sourceCode: action.payload.parentCode,
                                                    linkValue: "LINK",
                                                    valueString: "LINK",
                                                    link: {
                                                        attributeCode: "LINK",
                                                        weight: 1,
                                                        targetCode: newItem.code,
                                                        sourceCode: action.payload.parentCode,
                                                        linkValue: "LINK",
                                                    }
                                                }]
                                            ]
                                        }

                                        return existing;

                                    }, {})
                                }
                            }
                        }) : ({})
                    ),
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

                        if (action.payload.aliasCode) {
                            existing[action.payload.aliasCode] = newItem.code;
                        }

                        return existing;

                    }, {})
                }
            };

        case ATTRIBUTE:

            return {
                ...state,
                attributes: action.payload.items.map(item => { return item.defaultPrivacyFlag === false || item.defaultPrivacyFlag == null ? item : false }),
            };

        case ANSWER:

            let newAnswers = action.payload.items;
            newAnswers.forEach(newAnswer => {

                let be_code = newAnswer.targetCode;
                let newValue = newAnswer.value;
                //if (typeof newValue != 'string') { return; }

                let attributeCode = newAnswer.attributeCode;
                if (be_code && attributeCode && (newAnswer.privacyFlag === false || newAnswer.privacyFlag == null)) {

                    if (action.payload.delete) {

                        if (state.data[be_code] && state.data[be_code].attributes) {
                            delete state.data[be_code].attributes[attributeCode];
                        }
                    } else {

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

                        if (newAnswer.name) {
                            newAtt.name = newAnswer.name;
                        }

                        if (!state.data[be_code]) {
                            state.data[be_code] = {
                                attributes: {}
                            };
                        }

                        if (!state.data[be_code].attributes) {
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

            const item = action.payload;

            const newLink = item.link;
            const oldLink = item.oldLink;

            if (newLink != null) {

                let be_code = newLink.targetCode;
                const newLinkValue = newLink.linkValue;
                const newLinkCode = newLink.attributeCode;
                const newLinkWeight = newLink.weight;
                const newParentCode = newLink.sourceCode;

                if (state.data[be_code] != null) {

                    if (item.oldLink != null && newParentCode != item.oldLink.sourceCode) {

                        const oldLinkCode = item.oldLink.attributeCode;
                        const oldParentCode = item.oldLink.sourceCode;

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
                                    links: {
                                        ...(state.data[oldParentCode] && state.data[oldParentCode].links ? state.data[oldParentCode].links : {}),
                                        [oldLinkCode]: ((state.data[oldParentCode] && state.data[oldParentCode].links && state.data[oldParentCode].links[oldLinkCode]) ? state.data[oldParentCode].links[oldLinkCode].reduce(((existing, link) => {

                                            if (link != null && link.targetCode != be_code) {
                                                existing.push(link);
                                            }

                                            return existing;

                                        }), []) : [])
                                    },
                                    children: [
                                        ...(state.data[oldParentCode] && state.data[oldParentCode].children ? state.data[oldParentCode].children.reduce((existing, child) => {

                                            if (child.code != be_code) existing.push(child);
                                            return existing;

                                        }, []) : [])
                                    ]
                                },
                                [newParentCode]: {
                                    ...state.data[newParentCode],
                                    links: {
                                        ...((state.data[newParentCode] && state.data[newParentCode].links) ? state.data[newParentCode].links : {}),
                                        [newLinkCode]: (state.data[newParentCode] && state.data[newParentCode].links && state.data[newParentCode].links[newLinkCode] ? state.data[newParentCode].links[newLinkCode].reduce(((existing, link) => {

                                            if (link != null && link.targetCode != be_code) {
                                                existing.push(link);
                                            } else if (link != null && link.targetCode == be_code) {
                                                link = {
                                                    ...link,
                                                    value: newLinkValue,
                                                    valueString: newLinkValue,
                                                    weight: newLinkWeight,
                                                    targetCode: be_code,
                                                    linkValue: newLinkValue
                                                };
                                                existing.push(link);
                                            }

                                            return existing;

                                        }), []) : [{
                                            value: newLinkValue,
                                            valueString: newLinkValue,
                                            weight: newLinkWeight,
                                            targetCode: be_code,
                                            linkValue: newLinkValue
                                        }])
                                    },
                                    children: [
                                        ...(state.data[newParentCode] && state.data[newParentCode].children ? state.data[newParentCode].children : []),
                                        {
                                            ...state.data[be_code],
                                        }
                                    ]
                                }
                            },
                            relationships: {
                                ...state.relationships,
                                [oldParentCode]: Object.keys(state.relationships[oldParentCode] ? state.relationships[oldParentCode] : {}).reduce((existing, key) => {

                                    if (key != be_code) {
                                        existing[key] = state.relationships[oldParentCode][key];
                                    }

                                    return existing;

                                }, {}),
                                [newParentCode]: {
                                    ...state.relationships[newParentCode],
                                    [be_code]: { type: BASE_ENTITY, weight: newLinkWeight == 0 ? 0 : 1 }
                                }
                            }
                        };
                    } else {

                        const linkAlreadyExist = (state.data[newParentCode] && state.data[newParentCode].links && state.data[newParentCode].links[newLinkCode]);
                        let newLinks = [];

                        if (linkAlreadyExist) {

                            let found = false;
                            state.data[newParentCode].links[newLinkCode].forEach(existingLink => {

                                if (existingLink != null && existingLink.targetCode != be_code) {
                                    newLinks.push(existingLink);
                                } else if (existingLink != null && existingLink.targetCode == be_code) {

                                    found = true;
                                    existingLink = {
                                        ...existingLink,
                                        value: newLinkValue,
                                        valueString: newLinkValue,
                                        weight: newLinkWeight,
                                        targetCode: be_code,
                                        linkValue: newLinkValue
                                    };

                                    newLinks.push(existingLink);
                                }
                            });

                            if (found == false) {

                                newLinks.push({
                                    value: newLinkValue,
                                    valueString: newLinkValue,
                                    weight: newLinkWeight,
                                    targetCode: be_code,
                                    linkValue: newLinkValue
                                });
                            }

                        } else {
                            newLinks = [{
                                value: newLinkValue,
                                valueString: newLinkValue,
                                weight: newLinkWeight,
                                targetCode: be_code,
                                linkValue: newLinkValue
                            }];
                        }

                        return {
                            ...state,
                            data: {
                                ...state.data,
                                [be_code]: {
                                    ...state.data[be_code],
                                    parentCode: newParentCode
                                },
                                [newParentCode]: {
                                    ...state.data[newParentCode],
                                    links: {
                                        ...(state.data[newParentCode] && state.data[newParentCode].links ? state.data[newParentCode].links : {}),
                                        [newLinkCode]: newLinks
                                    },
                                    children: [
                                        ...((state.data[newParentCode] && state.data[newParentCode].children) ? state.data[newParentCode].children : []),
                                        {
                                            ...state.data[be_code],
                                        }
                                    ]
                                }
                            },
                            relationships: {
                                ...state.relationships,
                                [newParentCode]: {
                                    ...state.relationships[newParentCode],
                                    [be_code]: { type: BASE_ENTITY, weight: newLinkWeight == 0 ? 0 : 1 }
                                }
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