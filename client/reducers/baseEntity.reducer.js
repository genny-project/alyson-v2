import { BASE_ENTITY, BASE_ENTITY_DATA, ATTRIBUTE, ANSWER, EVT_LINK_CHANGE } from 'constants';
import { grabValue } from './utils.reducer';

const initialState = {
    data: {},
    relationships: {},
    aliases: {},
    attributes: [],
};

const deleteBaseEntity = (state, action, existing, newItem, shouldDeleteLinkedBaseEntities) => {

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

    if(shouldDeleteLinkedBaseEntities) {

        if(state.data[baseEntityCode] != null) {

            Object.keys(state.data[baseEntityCode].links).forEach(linkCode => {

                const links = state.data[baseEntityCode].links[linkCode];
                links.forEach(link => {

                    if(link.targetCode != null) {
                        delete state.data[link.targetCode];
                    }
                });
            });
        }
    }

    delete existing[baseEntityCode];
    delete state.data[baseEntityCode];

};

const handleBaseEntity = (state, action, existing, newItem) => {

    let baseEntityCode = newItem.code;

    if (action.payload.delete === true) {
        deleteBaseEntity(state, action, existing, newItem, action.payload.shouldDeleteLinkedBaseEntities);

    } else {

        if(action.payload.replace == true) {
            deleteBaseEntity(state, action, existing, newItem, true);
        }

        if (!newItem.baseEntityAttributes) {

            existing[baseEntityCode] = {
                ...state.data[baseEntityCode],
                ...existing[baseEntityCode],
                ...newItem,
                originalLinks: newItem.links,
                links: newItem.links.reduce((existingLinks, newLink) => {

                    let linkCode = newLink.link ? newLink.link.attributeCode : null;
                    console.log( 'current link code: ', linkCode )
                    if (!linkCode) return existingLinks;

                    if (!existingLinks[linkCode]) {
                        existingLinks[linkCode] = [];
                        existingLinks[linkCode].push({
                            ...newLink,
                            targetCode: newLink.link.targetCode,
                            linkValue: newLink.valueString || newLink.link.linkValue,
                            weight: newLink.weight,
                        });
                    }
                    else {

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
                                weight: newLink.weight,
                            };
                        }
                        else {

                            existingLinks[linkCode].push({
                                ...newLink,
                                targetCode: newLink.link.targetCode,
                                linkValue: newLink.valueString || newLink.link.linkValue,
                                weight: newLink.weight,
                            });
                        }
                    }

                    return existingLinks;

                }, (state.data[baseEntityCode] && state.data[baseEntityCode].links ? state.data[baseEntityCode].links : {})),
                linkCode: newItem.linkCode || "LNK_CORE",
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
                        weight: newLink.weight,
                    });
                }
                else {

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
                            weight: newLink.weight,
                        };
                    } 
                    else {

                        existingLinks[linkCode].push({
                            ...newLink,
                            targetCode: newLink.link.targetCode,
                            linkValue: newLink.valueString || newLink.link.linkValue,
                            weight: newLink.weight,
                        });
                    }
                }

                return existingLinks;

            }, (state.data[baseEntityCode] && state.data[baseEntityCode].links ? state.data[baseEntityCode].links : {})),
            linkCode: newItem.linkCode || "LNK_CORE",
            attributes: existingAttributes
        };

        delete existing[baseEntityCode].baseEntityAttributes;
    }
};

const handleBaseEntityParent = (state, action, existing, newItem) => {

    /* if the newItem has a parentCode */
    if(newItem.parentCode != null) {

        /* we update the data for the parent */
        if (newItem.code != null) {

            /* get the link code to the children */
            let linkCode = newItem.linkCode;
            let indexLink = -1;

            /* we check if the parent data exists or we create it */
            if(state.data[newItem.parentCode] == null) {

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
            }

            if (state.data[newItem.parentCode] == null || state.data[newItem.parentCode].links == null) {

                if (linkCode == null) {

                    if (newItem.parentCode.startsWith("BEG_")) {
                        linkCode = "LNK_BEG";
                    } else if (newItem.parentCode.startsWith("OFR_")) {
                        linkCode = "LNK_OFR";
                    } else {
                        linkCode = "LNK_CORE";
                    }
                }
            }
            else {
                const keys = Object.keys(state.data[newItem.parentCode].links);
                for (let i = 0; i < keys.length; i++) {

                    if (indexLink > -1) break;

                    const linkCde = keys[i];
                    for (let t = 0; t < state.data[newItem.parentCode].links[linkCde].length; t++) {

                        const element = state.data[newItem.parentCode].links[linkCde][t];
                        if (element && element.targetCode && element.targetCode == newItem.code) {
                            indexLink = t;
                            linkCode = linkCde;
                            break;
                        }
                    }
                }
            }

            let links = (existing[newItem.parentCode] != null && existing[newItem.parentCode].links != null ? existing[newItem.parentCode].links : {});

            if (indexLink == -1) {

                if (links[linkCode] == null) {
                    links[linkCode] = [];
                }

                links[linkCode] = [
                    ...links[linkCode],
                    ...[{
                        attributeCode: linkCode,
                        weight: newItem.weight || 1,
                        targetCode: newItem.code,
                        sourceCode: newItem.parentCode,
                        linkValue: "LINK",
                        valueString: "LINK",
                        link: {
                            attributeCode: linkCode,
                            weight: newItem.weight || 1,
                            targetCode: newItem.code,
                            sourceCode: newItem.parentCode,
                            linkValue: "LINK",
                        }
                    }]
                ]
            }
            else {

                links[linkCode] = [
                    ...state.data[newItem.parentCode].links[linkCode],
                ]

                links[linkCode][indexLink] = {
                    ...links[linkCode][indexLink],
                    weight: newItem.weight,
                    linkValue: newItem.linkValue,
                    valueString: newItem.valueString,
                }
            }

            existing[newItem.parentCode] = {
                ...state.data[newItem.parentCode],
                ...existing[newItem.parentCode],
                links: links
            }
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

                        if (newItem.aliasCode) {
                            existing[newItem.aliasCode] = newItem.code;
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
