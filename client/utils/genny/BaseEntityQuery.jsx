import store from 'views/store';
import { GennyBridge } from 'utils/genny';

class BaseEntityQuery {

    static sortItems(items) {
        return items.sort((x, y) => x.weight > y.weight).filter(x => x.hidden !== true && x.weight > 0);
    }

    static getEntityChildren(code, recursionSafeCodes) {

        const safeRecursion = recursionSafeCodes != null ? recursionSafeCodes : new Object();
        const relationships = store.getState().baseEntity.relationships;
        const grp = relationships[code];

        let items = grp ? Object.keys(grp).filter(x => x != 'DUMMY').map(code => Object.assign({}, store.getState().baseEntity.data[code])) : [];

        let rootEntity = BaseEntityQuery.getBaseEntity(code);

        if (items.length == 0) {

            if (!grp && code.indexOf('GRP') == 0) {
                relationships[code] = {};
            }

            if (relationships[code] && !relationships[code]['DUMMY']) {

                // set dummy value so we wont call this again
                relationships[code]['DUMMY'] = {
                    hidden: true,
                    weight: 0,
                    type: 'BaseEntity' // do not remove
                };

                GennyBridge.sendTVEvent('TV_EXPAND', {
                    code: 'TV1',
                    value: code
                }, code);
            }

            return [];
        }

        items = items.map(item => {

            if (item) {

                // order by weight if found in links
                let weight = item.weight;
                if (rootEntity != null && rootEntity.links != null) {

                    let allLinks = Object.keys(rootEntity.links).map(lnkKey => rootEntity.links[lnkKey]);
                    allLinks = allLinks.length > 0 ? allLinks[0] : [];

                    let currentLinks = allLinks.filter(x => {
                        return x != null && x.link != null && x.link.targetCode != null && x.link.targetCode == item.code;
                    });

                    weight = currentLinks.length > 0 ? currentLinks[0].weight : weight;
                }

                if (!Object.keys(safeRecursion).includes(item.code)) {

                    safeRecursion[item.code] = {};
                    item.children = this.getEntityChildren(item.code, safeRecursion);
                } else {
                    item.children = [];
                }

                item.weight = weight;
                return item;
            }

            return false;
        });
        return BaseEntityQuery.sortItems(items);
        //return items.sort((x, y) => x.weight > y.weight).filter(x => x.hidden !== true && x.weight > 0);
    }

    static getLinkedBaseEntities = (baseEntityCode, linkCode, type, linkValues) => {

        let be = BaseEntityQuery.getBaseEntity(baseEntityCode);
        let targets = [];

        if (be && be.links && be.links[linkCode]) {

            be.links[linkCode].forEach(link => {

                if ( type == 'hide'){
                    if (!linkValues || !linkValues.includes(link.linkValue)) {

                        if (link != null && link.targetCode && link.weight > 0) {
                            let targetBe = BaseEntityQuery.getBaseEntity(link.targetCode);
    
                            if (targetBe) targets.push({
                                ...targetBe,
                                weight: link.weight
                            });
                        }
                    }
                }
                else if ( type == 'show'){
                    if (linkValues && linkValues.includes(link.linkValue)) {

                        if (link != null && link.targetCode && link.weight > 0) {
                            let targetBe = BaseEntityQuery.getBaseEntity(link.targetCode);
    
                            if (targetBe) targets.push({
                                ...targetBe,
                                weight: link.weight
                            });
                        }
                    }
                }
            });
        }
        return BaseEntityQuery.sortItems(targets);
        //return targets.sort((x, y) => x.weight > y.weight).filter(x => x.hidden !== true && x.weight > 0);
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

                const groupKey = groupKeys[i]
                const group = relationships[groupKey];
                if (group) {

                    let childKeys = Object.keys(group);
                    for (var j = 0; j < childKeys.length; j++) {

                        const childKey = childKeys[j]
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
                    if (currentLink.linkValue == linkValue) {

                        const be = BaseEntityQuery.getBaseEntity(currentLink.targetCode);
                        if(be != null) {
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
        if(bes != null && bes.length > 0) {
            return bes[0];
        }

        return null;
    }

    static getBaseEntitiesForLinkCode = (baseEntityCode, type, linkValues) => {

        let be = BaseEntityQuery.getBaseEntity(baseEntityCode);
        if (be && be.links) {
            const bes = Object.keys(be.links).map(link => BaseEntityQuery.getLinkedBaseEntities(baseEntityCode, link, type, linkValues));
            if(bes != null && bes.length > 0) return bes[0];
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
