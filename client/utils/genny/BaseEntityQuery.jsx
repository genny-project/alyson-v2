import store from 'views/store';
import { GennyBridge } from 'utils/genny';

class BaseEntityQuery {

    static getEntityChildren(code) {

        const relationships = store.getState().baseEntity.relationships;
        const grp = relationships[code];

        let items = grp ? Object.keys(grp).filter(x => x != 'DUMMY').map(code => store.getState().baseEntity.data[code]) : [];

        let rootEntity = BaseEntityQuery.getBaseEntity(code);

        items = items.map(item => {

            if(item) {

                // order by weight if found in links
                let weight = item.weight;
                if(rootEntity != null && rootEntity.originalLinks) {

                    let currentLinks = rootEntity.originalLinks.filter(x => {
                        return x.link.targetCode == item.code;
                    });

                    weight = currentLinks.length > 0 ? currentLinks[0].weight : weight;
                }

                const children = this.getEntityChildren(item.code);
                item.children = children;
                item.weight = weight;
                return item;
            }

            return false;
        });

        if(items.length == 0) {

            if(!grp && code.indexOf('GRP') == 0) {
                relationships[code] = {};
            }

            if(relationships[code] && !relationships[code]['DUMMY']) {

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
        }

        return items.sort((x, y) => x.weight > y.weight).filter(x => x.hidden !== true && x.weight > 0);
    }

    static getLinkedBaseEntities = (baseEntityCode, linkCode, excludingLinks) => {

        let be = BaseEntityQuery.getBaseEntity(baseEntityCode);

        if(be && be.links && be.links[linkCode]) {

            return be.links[linkCode].reduce((existingBes, link) => {

                if(excludingLinks && excludingLinks.includes(link.linkValue)) {
                    return existingBes.sort((x,y) => x.weight > y.weight);
                }

                if(link.targetCode && link.weight > 0) {
                    let targetBe = BaseEntityQuery.getBaseEntity(link.targetCode);
                    if(targetBe) existingBes.push(targetBe);
                }

                return existingBes.sort((x,y) => x.weight > y.weight);

            }, []);
        }

        return [];
    }

    static getLinkToParent(parentCode, childCode) {

        if(parentCode && childCode) {

            const parent = BaseEntityQuery.getBaseEntity(parentCode);
            if(parent) {

                let keys = Object.keys(parent.links);
                for(let i = 0; i < keys.length; i++) {

                    const linkKey = keys[i];
                    const links = parent.links[linkKey];
                    for(let j = 0; j < links.length; j++) {

                        const link = links[j];
                        if(link.targetCode == childCode) {
                            return link;
                       }
                    }
                }
            }
        }

        return null;
    }

    static getBaseEntityParent(childCode, group) {

        const relationships = group || store.getState().baseEntity.relationships;

        const groupKeys = Object.keys(relationships);
        for (var i = 0; i < groupKeys.length; i++) {

            const groupKey = groupKeys[i]
            const group = relationships[groupKey];

            let childKeys = Object.keys(group);
            for (var j = 0; j < childKeys.length; j++) {

                const childKey = childKeys[j]
                const child = group[childKey];

                if(child.type == "BaseEntity") {
                    if(childKey == childCode) {
                        return BaseEntityQuery.getBaseEntity(groupKey);
                    }
                }
                else {
                    return BaseEntityQuery.getBaseEntityParent(childCode, group);
                }
            }
        }

        return null;
    }

    static getBaseEntitiesForLinkCode = (baseEntityCode, excludingLinks) => {

        let be = BaseEntityQuery.getBaseEntity(baseEntityCode);
        if(be && be.links) {
            return Object.keys(be.links).map(link => BaseEntityQuery.getLinkedBaseEntities(baseEntityCode, link, excludingLinks))[0];
        }

        return [];
    }

    static getAlias = (alias_code) => {

        let aliases = store.getState().baseEntity.aliases;
        let matchingAliases = Object.keys(aliases).filter(x => x == alias_code);
        if(matchingAliases.length > 0) {

            let be_code = aliases[matchingAliases[0]];
            let baseEntities = store.getState().baseEntity.data;
            let matchingEntities = Object.keys(baseEntities).filter(x => x == be_code);
            if(matchingEntities.length > 0) {
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
        if(be && be.attributes) {
            return be.attributes[attribute_code];
        }

        return null;
    }

    static getBaseEntityAttribute = (baseEntityCode, attribute_code) => {

        let be = BaseEntityQuery.getBaseEntity(baseEntityCode);
        if(be && be.attributes) {
            return be.attributes[attribute_code];
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
