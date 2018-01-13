import React, { Component } from 'react';
import { object, array } from 'prop-types';
import LayoutNotFound from './layout-not-found';
import components from './components';
import { JSONLoader } from '@genny-project/layson';
import { BaseEntityQuery } from 'utils/genny';

class LayoutLoader extends Component {

    static defaultProps = {

      }

  static propTypes = {
    layout: object,
    baseEntity: object,
    aliases: object
  };

  getLayoutValues(layout) {

      let layoutValues = [];
      if(layout instanceof Object) {
          Object.keys(layout).forEach(key => {

              let results = this.getLayoutValues(layout[key]);
              if(results instanceof Array) {
                  results.forEach(result => {
                     layoutValues.push(result);
                  });
              }
              else {
                  layoutValues.push(results);
              }
          });
      }
      else if (layout instanceof Array) {
          layout.forEach(value => {
              let results = this.getLayoutValues(value);
              if(results instanceof Array) {
                  results.forEach(result => {
                     layoutValues.push(result);
                  });
              }
              else {
                  layoutValues.push(results);
              }
          });
      }
      else if (typeof layout == "string") {
          return [layout];
      }
      return layoutValues;
  }

  replaceAliasesIn(layout, localAliases) {

      let aliases = this.getLayoutValues(layout);
      aliases.forEach(alias => {

        let split = alias.split(".");
        let alias_code = split[0];
        let attribute_code = split[1];
        let attribute = {}

        if (localAliases) {

           Object.keys(localAliases).forEach((alias_key, index) => {

               let localAliasCode = localAliases[alias_key];
               if(alias_key == alias_code) {

                   let baseEntity = BaseEntityQuery.getBaseEntity(localAliasCode);
                   if(baseEntity) {

                       attribute = split.length == 2 ? BaseEntityQuery.getBaseEntityAttribute(localAliasCode, attribute_code) : null;
                       if(!attribute) {
                           layout = JSON.parse(JSON.stringify(layout).replace(alias, baseEntity.code));
                       }
                   }
                }
            });
        }
        else {
            if(split.length == 2) {
                attribute = BaseEntityQuery.getAliasAttribute(alias_code, attribute_code) || BaseEntityQuery.getBaseEntityAttribute(alias_code, attribute_code);
                if(!attribute) {

                    let baseEntity = BaseEntityQuery.getAlias(alias_code);
                    if(baseEntity) {
                        attribute = {
                            value: baseEntity.code
                        };
                    }
                }
            }
        }

        if(attribute && attribute.value) {
            layout = JSON.parse(JSON.stringify(layout).replace(alias, attribute.value));
        }

      });

      return layout;
  }

  render() {

    const { layout, baseEntity, aliases } = this.props;

    let finalLayout = this.replaceAliasesIn(layout, aliases);
    return <JSONLoader layout={finalLayout} componentCollection={components} />;
  }
}

export default LayoutLoader;
