import React, {
    Component
} from 'react';
import {
    object
} from 'prop-types';
import components from './components';
import {
    JSONLoader
} from '@genny-project/layson';
import {
    BaseEntityQuery
} from 'utils/genny';

class LayoutLoader extends Component {

    static defaultProps = {

    }

    static propTypes = {
        layout: object,
        baseEntity: object,
        aliases: object
    };

    shouldComponentUpdate() {
        return true;
    }

    getLayoutValues(layout) {

        let layoutValues = [];
        if (layout instanceof Object) {
            Object.keys(layout).forEach(key => {

                let results = this.getLayoutValues(layout[key]);
                if (results instanceof Array) {
                    results.forEach(result => {
                        layoutValues.push(result);
                    });
                } else {
                    layoutValues.push(results);
                }
            });
        } else if (layout instanceof Array) {

            layout.forEach(value => {
                let results = this.getLayoutValues(value);
                if (results instanceof Array) {
                    results.forEach(result => {
                        layoutValues.push(result);
                    });
                } else {
                    layoutValues.push(results);
                }
            });
        } else if (typeof layout == 'string') {
            return [layout];
        }

        return layoutValues;
    }

    replaceAliasesIn(layout, localAliases) {

        let aliases = this.getLayoutValues(layout);
        aliases.forEach(alias => {

            let splitValue = '';
            let toBeReplacedAlias = alias;

            if (alias.includes('${')) {

                const regex = /[$][{](.*?)[}]/g;
                const v = regex.exec(alias);

                //console.log(v);
                if (v != null) {
                    if (v[1] != null) {
                        splitValue = v[1];
                        toBeReplacedAlias = v[0];
                    }
                }
            } else {
                splitValue = alias;
            }

            splitValue = splitValue.split('.');
            let alias_code = splitValue[0];
            let attribute_code = splitValue[1];
            let attribute = {};

            if (localAliases) {

                Object.keys(localAliases).forEach((alias_key) => {
                    let localAliasCode = localAliases[alias_key];

                    if (alias_key == alias_code) {

                        let baseEntity = BaseEntityQuery.getBaseEntity(localAliasCode);
                        if (baseEntity) {

                            if (attribute_code && attribute_code.startsWith('LNK_')){
                                const lnk_value = baseEntity.attributes[attribute_code];

                                if (lnk_value && lnk_value.value && lnk_value.value.startsWith('[')) {
                                    const lnk_valueParse = JSON.parse(lnk_value.value);
                                    if (
                                        lnk_valueParse != null &&
                                        lnk_valueParse instanceof Array &&
                                        lnk_valueParse.length > 0
                                    ) {
                                        const attributeArray = [];
                                        lnk_valueParse.forEach(x => {
                                            const lnk_field = splitValue[2];
                                            let tempAttribute = null;
                                            if (lnk_field == 'created') {
                                                tempAttribute = {
                                                    value: BaseEntityQuery.getBaseEntityField(x, 'created')
                                                };
                                            } else if (lnk_field == 'code') {
                                                tempAttribute = {
                                                    value: BaseEntityQuery.getBaseEntityField(x, 'code')
                                                };
                                            } else if (lnk_field == 'name') {
                                                tempAttribute =  {
                                                    value: BaseEntityQuery.getBaseEntityField(x, 'name')
                                                };
                                            } else {
                                                tempAttribute = BaseEntityQuery.getBaseEntityAttribute(x, lnk_field);
                                            }

                                            if (tempAttribute != null && tempAttribute.value != null ) attributeArray.push(tempAttribute);

                                        });

                                        attribute = {
                                            value: attributeArray.length > 0 ? attributeArray.map(x => x.value).join(', ') : null,
                                        };
                                    }
                                }
                                else if (lnk_value && lnk_value.value) {
                                    const lnk_field = splitValue[2];

                                    if (lnk_field == 'created') {
                                        attribute = {
                                            value: BaseEntityQuery.getBaseEntityField(lnk_value.value, 'created')
                                        };
                                    } else if (lnk_field == 'code') {
                                        attribute = {
                                            value: BaseEntityQuery.getBaseEntityField(lnk_value.value, 'code')
                                        };
                                    } else if (lnk_field == 'name') {
                                        attribute = {
                                            value: BaseEntityQuery.getBaseEntityField(lnk_value.value, 'name')
                                        };
                                    } else {
                                        attribute = BaseEntityQuery.getBaseEntityAttribute(lnk_value.value, lnk_field);
                                    }
                                    // console.log(attribute);
                                }
                            } else if (attribute_code == 'created') {
                                attribute = {
                                    value: BaseEntityQuery.getBaseEntityField(localAliasCode, 'created')
                                };
                            } else if (attribute_code == 'name') {
                                attribute = {
                                    value: BaseEntityQuery.getBaseEntityField(localAliasCode, 'name')
                                };
                            } else if (attribute_code == 'code') {
                                attribute = {
                                    value: BaseEntityQuery.getBaseEntityField(localAliasCode, 'code')
                                };
                            }
                            else if (attribute_code == 'parent') {

                                /* format:
                                 * BE.parent.attributeCode
                                 */

                                if (splitValue.length >=  3) {

                                    /* we grab the parent */
                                    const parent = BaseEntityQuery.getBaseEntityParent(localAliasCode);

                                    if (parent != null) {

                                        const be_attribute = splitValue[2];
                                        /* we grab the attribute of the parent */
                                        // TODO: put that into a function instead of copy pasting grrrrr
                                        if (be_attribute == 'created') {
                                            attribute = {
                                                value: BaseEntityQuery.getBaseEntityField(parent.code, 'created')
                                            };
                                        } else if (be_attribute == 'code') {
                                            attribute = {
                                                value: BaseEntityQuery.getBaseEntityField(parent.code, 'code')
                                            };
                                        } else if (be_attribute == 'name') {
                                            attribute = {
                                                value: BaseEntityQuery.getBaseEntityField(parent.code, 'name')
                                            };
                                        } else if (be_attribute == 'link') {

                                            const linkValue = splitValue[3];
                                            const be_attribute_parent = splitValue[4];
                                            if (linkValue != null && be_attribute_parent != null) {
                                                const linkedBaseEntity = BaseEntityQuery.getLinkedBaseEntity(parent.code, linkValue);
                                                if (linkedBaseEntity != null) {

                                                    if (be_attribute_parent == 'created') {
                                                        attribute = {
                                                            value: BaseEntityQuery.getBaseEntityField(linkedBaseEntity.code, 'created')
                                                        };
                                                    } else if (be_attribute_parent == 'code') {
                                                        attribute = {
                                                            value: BaseEntityQuery.getBaseEntityField(linkedBaseEntity.code, 'code')
                                                        };
                                                    } else if (be_attribute_parent == 'name') {
                                                        attribute = {
                                                            value: BaseEntityQuery.getBaseEntityField(linkedBaseEntity.code, 'name')
                                                        };
                                                    } else {
                                                        attribute = BaseEntityQuery.getBaseEntityAttribute(linkedBaseEntity.code, be_attribute_parent);
                                                    }
                                                }
                                            }

                                            // console.log('===========================');

                                            if (be_attribute_parent.startsWith('LNK_')){
                                                const linkedBaseEntity = BaseEntityQuery.getLinkedBaseEntity(localAliasCode, linkValue);

                                                if ( linkedBaseEntity && linkedBaseEntity.code) {
                                                    const linkedBECode = linkedBaseEntity.code;
                                                    const lnk_value = BaseEntityQuery.getBaseEntityAttribute(linkedBECode, be_attribute_parent);

                                                    if (lnk_value && lnk_value.value && lnk_value.value.startsWith('[')) {
                                                        // console.log(lnk_value.value);
                                                        const lnk_valueParse = JSON.parse(lnk_value.value);

                                                        if (
                                                            lnk_valueParse != null &&
                                                            lnk_valueParse instanceof Array &&
                                                            lnk_valueParse.length > 0
                                                        ) {
                                                            const attributeArray = [];
                                                            lnk_valueParse.forEach(x => {
                                                                const lnk_field = splitValue[4];
                                                                let tempAttribute = null;
                                                                if (lnk_field == 'created') {
                                                                    tempAttribute = {
                                                                        value: BaseEntityQuery.getBaseEntityField(x, 'created')
                                                                    };
                                                                } else if (lnk_field == 'code') {
                                                                    tempAttribute = {
                                                                        value: BaseEntityQuery.getBaseEntityField(x, 'code')
                                                                    };
                                                                } else if (lnk_field == 'name') {
                                                                    tempAttribute =  {
                                                                        value: BaseEntityQuery.getBaseEntityField(x, 'name')
                                                                    };
                                                                } else {
                                                                    tempAttribute = BaseEntityQuery.getBaseEntityAttribute(x, lnk_field);
                                                                }

                                                                if (tempAttribute != null && tempAttribute.value != null ) attributeArray.push(tempAttribute);

                                                            });

                                                            attribute = {
                                                                value: attributeArray.length > 0 ? attributeArray.map(x => x.value).join(', ') : null,
                                                            };
                                                        }
                                                    }
                                                    else if (lnk_value && lnk_value.value) {


                                                        const lnk_field = splitValue[5];
                                                        // console.log(lnk_value.value, lnk_field);

                                                        if (lnk_field == 'created') {
                                                            attribute = {
                                                                value: BaseEntityQuery.getBaseEntityField(lnk_value.value, 'created')
                                                            };
                                                        } else if (lnk_field == 'code') {
                                                            attribute = {
                                                                value: BaseEntityQuery.getBaseEntityField(lnk_value.value, 'code')
                                                            };
                                                        } else if (lnk_field == 'name') {
                                                            attribute = {
                                                                value: BaseEntityQuery.getBaseEntityField(lnk_value.value, 'name')
                                                            };
                                                        } else {
                                                            attribute = BaseEntityQuery.getBaseEntityAttribute(lnk_value.value, lnk_field);
                                                        }
                                                        // console.log(attribute);
                                                    }
                                                }

                                            }

                                        } else {
                                            attribute = BaseEntityQuery.getBaseEntityAttribute(parent.code, be_attribute);
                                        }
                                    }
                                }
                            }
                            else if (attribute_code == 'link') {

                                const linkValue = splitValue[2];
                                const be_attribute = splitValue[3];

                                if (linkValue != null && be_attribute != null) {
                                    const linkedBaseEntity = BaseEntityQuery.getLinkedBaseEntity(localAliasCode, linkValue);
                                    if (linkedBaseEntity != null) {

                                        if (be_attribute == 'created') {
                                            attribute = {
                                                value: BaseEntityQuery.getBaseEntityField(linkedBaseEntity.code, 'created')
                                            };
                                        } else if (be_attribute == 'code') {
                                            attribute = {
                                                value: BaseEntityQuery.getBaseEntityField(linkedBaseEntity.code, 'code')
                                            };
                                        } else if (be_attribute == 'name') {
                                            attribute = {
                                                value: BaseEntityQuery.getBaseEntityField(linkedBaseEntity.code, 'name')
                                            };
                                        } else {
                                            attribute = BaseEntityQuery.getBaseEntityAttribute(linkedBaseEntity.code, be_attribute);
                                        }
                                    }
                                }

                                // console.log('===========================');

                                if (be_attribute.startsWith('LNK_')) {
                                    const linkedBaseEntity = BaseEntityQuery.getLinkedBaseEntity(localAliasCode, linkValue);

                                    if ( linkedBaseEntity && linkedBaseEntity.code) {
                                        const linkedBECode = linkedBaseEntity.code;
                                        const lnk_value = BaseEntityQuery.getBaseEntityAttribute(linkedBECode, be_attribute);

                                        if (lnk_value && lnk_value.value && lnk_value.value.startsWith('SEL_')) {


                                            const lnk_field = splitValue[4];
                                            // console.log(lnk_value.value, lnk_field);

                                            if (lnk_field == 'created') {
                                                attribute = {
                                                    value: BaseEntityQuery.getBaseEntityField(lnk_value.value, 'created')
                                                };
                                            } else if (lnk_field == 'code') {
                                                attribute = {
                                                    value: BaseEntityQuery.getBaseEntityField(lnk_value.value, 'code')
                                                };
                                            } else if (lnk_field == 'name') {
                                                attribute = {
                                                    value: BaseEntityQuery.getBaseEntityField(lnk_value.value, 'name')
                                                };
                                            } else {
                                                attribute = BaseEntityQuery.getBaseEntityAttribute(lnk_value.value, lnk_field);
                                            }
                                            // console.log(attribute);
                                        } else if (lnk_value && lnk_value.value && lnk_value.value.startsWith('[')) {
                                            // console.log(lnk_value.value);
                                            const lnk_valueParse = JSON.parse(lnk_value.value);

                                            if (
                                                lnk_valueParse != null &&
                                                lnk_valueParse instanceof Array &&
                                                lnk_valueParse.length > 0
                                            ) {
                                                const attributeArray = [];
                                                lnk_valueParse.forEach(x => {
                                                    const lnk_field = splitValue[4];
                                                    let tempAttribute = null;
                                                    if (lnk_field == 'created') {
                                                        tempAttribute = {
                                                            value: BaseEntityQuery.getBaseEntityField(x, 'created')
                                                        };
                                                    } else if (lnk_field == 'code') {
                                                        tempAttribute = {
                                                            value: BaseEntityQuery.getBaseEntityField(x, 'code')
                                                        };
                                                    } else if (lnk_field == 'name') {
                                                        tempAttribute = {
                                                            value: BaseEntityQuery.getBaseEntityField(x, 'name')
                                                        };
                                                    } else {
                                                        tempAttribute = BaseEntityQuery.getBaseEntityAttribute(x, lnk_field);
                                                    }

                                                    if (tempAttribute != null) attributeArray.push(tempAttribute);

                                                });

                                                attribute = {
                                                    value: attributeArray.length > 0 ? attributeArray.map(x => x.value).join(', ') : null,
                                                };
                                            }
                                        }
                                    }
                                }

                            } else if (attribute_code == 'links') {

                                const linkValue = splitValue[2];
                                const be_attribute = splitValue[3];
                                const isCount = splitValue[splitValue.length - 1] == 'count';
                                attribute = [];

                                if (linkValue != null && be_attribute != null) {

                                    const linkedBaseEntities = BaseEntityQuery.getLinkedBaseEntitiesByValue(localAliasCode, linkValue);

                                    let tempAttribute = [];
                                    linkedBaseEntities.forEach(linkedBaseEntity => {

                                        if (linkedBaseEntity != null) {

                                            if (be_attribute == 'created' || be_attribute == 'code') {
                                                tempAttribute.push(BaseEntityQuery.getBaseEntityField(linkedBaseEntity.code, be_attribute));
                                            } else if (be_attribute == 'count') {
                                                tempAttribute.push(linkedBaseEntity.code);
                                            } else {
                                                tempAttribute.push(BaseEntityQuery.getBaseEntityAttribute(linkedBaseEntity.code, be_attribute));
                                            }
                                        }
                                    });
                                    attribute.value = (isCount == true ? tempAttribute.length : tempAttribute).toString();
                                    //attribute.value = tempAttribute.toString();
                                }
                            } else {
                                attribute = splitValue.length == 2 ? BaseEntityQuery.getBaseEntityAttribute(localAliasCode, attribute_code) : null;
                            }
                            // console.log('ATTRIBUTE', attribute);
                            // console.log('-------------------');

                            if (attribute == null && attribute_code != null && (splitValue.length == 2 || splitValue.length == 4)) {
                                layout = JSON.parse(JSON.stringify(layout).replace(toBeReplacedAlias, ''));
                            } else if (alias_code == 'ROOT') {
                                layout = JSON.parse(JSON.stringify(layout).replace(toBeReplacedAlias, baseEntity.code));
                            } else if (alias_code != 'BE'){
                                layout = JSON.parse(JSON.stringify(layout).replace(toBeReplacedAlias, baseEntity.code));
                            }
                        }
                    }
                });
            }

            if (!localAliases || alias_code == 'USER' || alias_code == 'PROJECT') {
                if (splitValue.length == 2) {

                    attribute = BaseEntityQuery.getAliasAttribute(alias_code, attribute_code) || BaseEntityQuery.getBaseEntityAttribute(alias_code, attribute_code);
                    if (attribute == null) {

                        let baseEntity = BaseEntityQuery.getAlias(alias_code);
                        if (baseEntity) {
                            attribute = {

                                value: baseEntity.code || alias_code
                            };
                        }
                    }
                }
            }

            if (attribute != null && attribute.value != null) {
                try {

                    if (layout != null) {

                        let stringified = JSON.stringify(layout);
                        if (stringified != null) {
                            //console.log(attribute);
                            stringified = stringified.replace(toBeReplacedAlias, attribute.value);
                            if (stringified != null) {
                                stringified = stringified.replace(/(\r\n|\n|\r)/gm, '<br>');
                                if (stringified != null) {
                                    layout = JSON.parse(stringified);
                                }
                            }
                        }
                    }
                } catch (e) {
                    //console.error(e);
                }
            }
        });

        return layout;
    }

    replace(str, stringToReplace, replacement) {

        if (str == null) return str;

        stringToReplace = stringToReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var re = new RegExp(stringToReplace, 'g');
        return str.replace(re, replacement);
    }

    hideAliasesIn(layout) {

        if (layout == null) return layout;

        const layoutString = JSON.stringify(layout)
        .replace(/\"PROJECT\.[^\"]*\"/g, '\"\"')
        .replace(/\"USER\.[^\"]*\"/g, '\"\"')
        .replace(/\"BE\.[^\"]*\"/g, '\"\"')
            .replace(/\${.*?\}/g, '-');

        try {
            layout = JSON.parse(layoutString);
        }
        catch( e ) {
            console.log( e )
        }

        return layout;
        //return JSON.parse(JSON.stringify( layout ).replace(/\"BE\..*\"/g, ''));
    }

    render() {

        const {
            layout,
            aliases
        } = this.props;

        let finalLayout = this.replaceAliasesIn(layout, aliases);
        finalLayout = this.hideAliasesIn(finalLayout);
        return <JSONLoader layout = {
            finalLayout
        }
        componentCollection = {
            components
        }
        />;
    }
}

export default LayoutLoader;
