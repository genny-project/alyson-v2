import store from 'views/store';
import { GennyBridge } from 'utils/genny';

let d = false;

class BaseEntityQuery {

    static sortItems(items) {
        return items.sort((x, y) => x.weight > y.weight).filter(x => x.hidden !== true && x.weight > 0);
    }

    static getEntityChildren(code, recursionSafeCodes) {
        return BaseEntityQuery.getAllLinkedBaseEntities(code);
    }

    static getAllLinkedBaseEntities = (baseEntityCode, recursionSafeCodes) => {

        const safeRecursion = recursionSafeCodes != null ? recursionSafeCodes : new Object();
        const be = BaseEntityQuery.getBaseEntity(baseEntityCode);

        let results = [];
        const recurse = (itemCode, itemWeight) => {

            let item = BaseEntityQuery.getBaseEntity(itemCode);
            if (item != null && item != undefined) {

                if (!Object.keys(safeRecursion).includes(item.code)) {

                    safeRecursion[item.code] = {};
                    item.children = BaseEntityQuery.getAllLinkedBaseEntities(item.code, safeRecursion);

                } else {
                    item.children = [];
                }

                item.weight = itemWeight;
                return item;
            }

            return null;
        }

        if (baseEntityCode == "GRP_ROOT") { // booouuuhhhhh channel40

            const baseEntity = store.getState().baseEntity;
            const beRoot = baseEntity.data["GRP_ROOT"];
            const items = beRoot && beRoot.children ? beRoot.children : [];

            let counter = 1;
            items.forEach(item => {

                const newItem = recurse(item.code, counter);
                if (newItem) {
                    results.push(newItem);
                }
                counter += 1;
            });

        } else {

            if (be != null && be.links != null) {

                Object.keys(be.links).forEach(linkCode => {

                    be.links[linkCode].forEach(linkedItem => {

                        if (linkedItem.targetCode != null) {
                            const newItem = recurse(linkedItem.targetCode, linkedItem.weight);
                            if (newItem) {
                                results.push(newItem);
                            }
                        }
                    });
                });
            }
        }

        return BaseEntityQuery.sortItems(results);
    }

    static getLinkedBaseEntities = (baseEntityCode, linkCode, type, linkValues) => {

        let be = BaseEntityQuery.getBaseEntity(baseEntityCode);
        let targets = [];

        if (be && be.links && be.links[linkCode]) {

            const add = (link) => {

                if (link != null && link.targetCode != null && link.weight > 0) {

                    let targetBe = BaseEntityQuery.getBaseEntity(link.targetCode);

                    if (targetBe != null) {
                      targets.push({
                          ...targetBe,
                          weight: link.weight
                      });
                    }
                }
            };

            be.links[linkCode].forEach(link => {

                if(link != null && link) {

                    if (type == 'hide') {

                        if (!linkValues || !linkValues.includes(link.linkValue)) {
                            add(link);
                        }
                    } else if (type == 'show') {

                        if (linkValues && linkValues.includes(link.linkValue)) {
                            add(link);
                        }
                    } else {
                        add(link);
                    }
                }
            });
        }

        return BaseEntityQuery.sortItems(targets);
    }

    static getAttribute(attribute_code) {

        if (attribute_code) {
            const all_attributes = store.getState().baseEntity.attributes;
            if (all_attributes) {
                return all_attributes.filter(att => att.code == attribute_code)[0];
            }
        }

        return null;
    }

    static getLinkToParent(parentCode, childCode) {

        if (parentCode && childCode) {

            const parent = BaseEntityQuery.getBaseEntity(parentCode);
            if (parent) {

                let keys = Object.keys(parent.links);
                for (let i = 0; i < keys.length; i++) {

                    const linkKey = keys[i];
                    const links = parent.links[linkKey];
                    for (let j = 0; j < links.length; j++) {

                        const link = links[j];
                        if (link != null && link.targetCode == childCode) {
                            return link;
                        }
                    }
                }
            }
        }

        return null;
    }

    static getBaseEntityParent(childCode, group) {

        const be = BaseEntityQuery.getBaseEntity(childCode);
        if (be != null && be.parentCode != null) {
            return BaseEntityQuery.getBaseEntity(be.parentCode);
        } else {

            const relationships = group || store.getState().baseEntity.relationships;

            const groupKeys = Object.keys(relationships);
            for (var i = 0; i < groupKeys.length; i++) {

                const groupKey = groupKeys[i];
                const group = relationships[groupKey];
                if (group) {

                    let childKeys = Object.keys(group);
                    for (var j = 0; j < childKeys.length; j++) {

                        const childKey = childKeys[j];
                        const child = group[childKey];

                        if (child) {

                            if (child.type == "BaseEntity") {
                                if (childKey == childCode) {
                                    return BaseEntityQuery.getBaseEntity(groupKey);
                                }
                            } else {
                                return BaseEntityQuery.getBaseEntityParent(childCode, group);
                            }
                        }
                    }
                }
            }
        }

        return null;
    }

    static getLinkedBaseEntitiesByValue = (baseEntityCode, linkValue) => {

        let be = BaseEntityQuery.getBaseEntity(baseEntityCode);
        let bes = [];
        if (be && be.links) {

            Object.keys(be.links).forEach(link => {

                const links = be.links[link];
                for (let i = 0; i < links.length; i++) {

                    let currentLink = links[i];
                    if (currentLink && currentLink.link && currentLink.link.linkValue == linkValue) {

                        const be = BaseEntityQuery.getBaseEntity(currentLink.targetCode);
                        if (be != null) {
                            bes.push(be);
                        }
                    }
                }

                return false;
            });

            return bes;
        }

        return bes;
    }

    static getLinkedBaseEntity = (baseEntityCode, linkValue) => {

        let bes = BaseEntityQuery.getLinkedBaseEntitiesByValue(baseEntityCode, linkValue);
        if (bes != null && bes.length > 0) {
            return bes[0];
        }

        return null;
    }

    static getBaseEntitiesForLinkCode = (baseEntityCode, type, linkValues) => {

        let be = BaseEntityQuery.getBaseEntity(baseEntityCode);
        if (be && be.links) {
            const bes = Object.keys(be.links).map(link => BaseEntityQuery.getLinkedBaseEntities(baseEntityCode, link, type, linkValues));
            if (bes != null && bes.length > 0) return bes[0];
        }

        return [];
    }

    static getAlias = (alias_code) => {

        let aliases = store.getState().baseEntity.aliases;
        let matchingAliases = Object.keys(aliases).filter(x => x == alias_code);
        if (matchingAliases.length > 0) {

            let be_code = aliases[matchingAliases[0]];
            let baseEntities = store.getState().baseEntity.data;
            let matchingEntities = Object.keys(baseEntities).filter(x => x == be_code);
            if (matchingEntities.length > 0) {
                return baseEntities[matchingEntities[0]];
            }
        }

        return null;
    }

    static getBaseEntity = (code) => {
        return store.getState().baseEntity.data[code];
    }

    static getAliasAttribute = (alias_code, attribute_code) => {

        let be = BaseEntityQuery.getAlias(alias_code);
        if (be && be.attributes) {
            return be.attributes[attribute_code];
        }

        return null;
    }

    static getBaseEntityAttribute = (baseEntityCode, attribute_code) => {
        let be = BaseEntityQuery.getBaseEntity(baseEntityCode);
        if (be && be.attributes) {
            return be.attributes[attribute_code];
        }

        return null;
    }

    static getBaseEntityAttributes = (baseEntityCode) => {

        let be = BaseEntityQuery.getBaseEntity(baseEntityCode);
        if (be) {
            return be.attributes;
        }

        return null;
    }

    static getBaseEntityField = (baseEntityCode, field) => {

        let be = BaseEntityQuery.getBaseEntity(baseEntityCode);
        return be ? be[field] : null;
    }

    static getBaseEntityCreationDate = (baseEntityCode) => {
        return BaseEntityQuery.getBaseEntityField(baseEntityCode, "created");
    }
}

export default BaseEntityQuery;
