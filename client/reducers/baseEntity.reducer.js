import { BASE_ENTITY, BASE_ENTITY_DATA, ATTRIBUTE, ANSWER, EVT_LINK_CHANGE } from 'constants';
import { grabValue } from './utils.reducer';
import {
    GennyBridge
} from 'utils/genny';

const initialState = {
    data: {},
    relationships: {},
    aliases: {},
    attributes: [],
};

const deleteBaseEntity = (state, action, existing, newItem, deleteBaseEntity, deleteDepth) => {

    let baseEntityCode = newItem.code;
    const parentCode = action.payload.parentCode;

    if(parentCode) {

        /* we remove the link to the parent */
        if(state.data[parentCode] && state.data[parentCode].links) {

            let newLinks = {};
            Object.keys(state.data[parentCode].links).forEach(linkCode => {

                let links = state.data[parentCode].links[linkCode];
                let newLinkedLinks = [];

                for(let i = 0; i < links.length; i++) {

                    const link = links[i];
                    if(link.targetCode != null && link.targetCode != baseEntityCode) {
                        newLinkedLinks.push(link);
                    }
                }

                newLinks[linkCode] = newLinkedLinks;
            });
        }
    }

    const deleteLinkedBaseEntities = function(beCode, level) {

        if (state.data[beCode] != null) {

            Object.keys(state.data[beCode].links).forEach(linkCode => {

                const links = state.data[beCode].links[linkCode];
                links.forEach(link => {

                    if (link.targetCode != null) {
                        if (level > 1) {
                            deleteLinkedBaseEntities(link.targetCode, level - 1);
                        }

                        if(link.targetCode != GennyBridge.getUser()) {
                            delete state.data[link.targetCode];
                        }
                    }
                });
            });
        }
    };

    if (deleteDepth > 0) {
        deleteLinkedBaseEntities(baseEntityCode, deleteDepth);
    }

    if (deleteBaseEntity) {
        delete existing[baseEntityCode];
        delete state.data[baseEntityCode];
    }
};

const handleBaseEntity = (state, action, existing, newItem) => {

    if(newItem != null) {

        let baseEntityCode = newItem.code;

        if (action.payload.delete === true) {

            let deleteDepth = 0;
            if (action.payload.shouldDeleteLinkedBaseEntities != null && typeof action.payload.shouldDeleteLinkedBaseEntities == 'number') {
                deleteDepth = action.payload.shouldDeleteLinkedBaseEntities;
            }
            else if (action.payload.shouldDeleteLinkedBaseEntities != null && action.payload.shouldDeleteLinkedBaseEntities === true) {
                deleteDepth = 1;
            }

            deleteBaseEntity(state, action, existing, newItem, action.payload.delete, deleteDepth);
        }
        else {

             let deleteDepth = 0;
             if (action.payload.shouldDeleteLinkedBaseEntities != null && typeof action.payload.shouldDeleteLinkedBaseEntities == 'number') {
                 deleteDepth = action.payload.shouldDeleteLinkedBaseEntities;
             }
             else if (action.payload.shouldDeleteLinkedBaseEntities != null && action.payload.shouldDeleteLinkedBaseEntities === true) {
                 deleteDepth = 1;
             }

            if (action.payload.replace == true) {
                deleteBaseEntity(state, action, existing, newItem, true, deleteDepth);
            }
            else if (deleteDepth > 0) {
                deleteBaseEntity(state, action, existing, newItem, false, deleteDepth);
            }

            if (!newItem.baseEntityAttributes) {

                existing[baseEntityCode] = {
                    ...state.data[baseEntityCode],
                    ...existing[baseEntityCode],
                    ...newItem,
                    parentCode: newItem.parentCode || (existing[baseEntityCode] ? existing[baseEntityCode].parentCode : null),
                    originalLinks: newItem.links,
                    links: newItem.links.reduce((existingLinks, newLink) => {

                        let linkCode = newLink.link ? newLink.link.attributeCode : null;
                        if (!linkCode) return existingLinks;

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
                    linkCode: newItem.linkCode || 'LNK_CORE',
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
                            ...{
                                value: grabValue(newAttribute),
                                baseEntityCode: baseEntityCode
                            }
                        };
                    }
                });
            }

            if(existing && existing[baseEntityCode] && existing[baseEntityCode].attributes) {
              existingAttributes = {
                ...existingAttributes,
                ...existing[baseEntityCode].attributes
              };
            }

            existing[baseEntityCode] = {
                ...state.data[baseEntityCode],
                ...existing[baseEntityCode],
                ...newItem,
                parentCode: newItem.parentCode || (existing[baseEntityCode] ? existing[baseEntityCode].parentCode : null),
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
                linkCode: newItem.linkCode || 'LNK_CORE',
                attributes: existingAttributes,
                weight: newItem.weight ? newItem.weight : 1,
            };

            delete existing[baseEntityCode].baseEntityAttributes;
        }
    }
};

const handleBaseEntityParent = (state, action, existing, newItem) => {

    /* if the newItem has a parentCode */
    if(newItem != null && newItem.parentCode != null) {

        /* we update the data for the parent */
        if (newItem.code != null) {

            /* get the link code to the children */
            let linkCode = newItem.linkCode;
            let defaultLinkValue = "LINK";
            if(linkCode == null) {

                if(newItem.parentCode.startsWith('BEG_')) {
                    linkCode = 'LNK_BEG';
                }
                else if(newItem.parentCode.startsWith('OFR_')) {
                    linkCode = 'LNK_OFR';
                }
                else {
                    linkCode = 'LNK_CORE';
                }
            }

            if(newItem.code.startsWith("BEG")) {
                defaultLinkValue = "BEG";
            }

            /* we check if the parent data exists or we create it */
            existing[newItem.parentCode] = {
                ...existing[newItem.parentCode]
            };

            if(existing[newItem.parentCode].links == null) {
                existing[newItem.parentCode].links = {
                    ...(state.data[newItem.parentCode] && state.data[newItem.parentCode].links ? state.data[newItem.parentCode].links : {})
                };
            }

            if(existing[newItem.parentCode].links[linkCode] == null) {
              existing[newItem.parentCode].links[linkCode] = [];
            }

            let links = (existing[newItem.parentCode] != null && existing[newItem.parentCode].links != null ? existing[newItem.parentCode].links : {});
            let linkedItemFound = links[linkCode].filter(x => x && x.targetCode && x.targetCode == newItem.code).length > 0;

            if(linkedItemFound == false) {

                if (links[linkCode] == null) {
                    links[linkCode] = [];
                }

                links[linkCode] = [
                    ...links[linkCode],
                    ...[{
                        attributeCode: linkCode,
                        weight: 1,
                        targetCode: newItem.code,
                        sourceCode: newItem.parentCode,
                        linkValue: newItem.linkValue || defaultLinkValue,
                        valueString: newItem.linkValue || defaultLinkValue,
                        link: {
                            attributeCode: linkCode,
                            weight: 1,
                            targetCode: newItem.code,
                            sourceCode: newItem.parentCode,
                            linkValue: newItem.linkValue || defaultLinkValue,
                        }
                    }]
                ];
            }

            existing[newItem.parentCode] = {
                ...state.data[newItem.parentCode],
                ...existing[newItem.parentCode],
                links: links
            };
        }
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
                        handleBaseEntityParent(state, action, existing, newItem);
                        return existing;
                    }, {}),
                },
                aliases: {
                    ...state.aliases,
                    ...action.payload.items.reduce((existing, newItem) => {

                        if (newItem != null && newItem.aliasCode) {
                            existing[newItem.aliasCode] = newItem.code;
                        }
                        return existing;

                    }, {})
                }
            };

        case ATTRIBUTE:

            return {
                ...state,
                attributes: action.payload.items.map(item => { return item.defaultPrivacyFlag === false || item.defaultPrivacyFlag == null ? item : false; }),
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
                            valueString: newAtt.value,
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
