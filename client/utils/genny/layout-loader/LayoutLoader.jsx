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
    aliases: array
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

         // step1: check if string has format: "ALIAS.ATTRIBUTE"
         let split = alias.split(".");
         if(split.length == 2) {

            let alias_code = split[0];
            let attribute_code = split[1];
            let attribute = {};
            if (localAliases) {
                let isMatch = null;
                localAliases.map(localAlias => {
                    let localAliasKey = null;
                    Object.keys(localAlias).map((localAlias_key, index) => {
                        localAliasKey = localAlias_key;
                    })
                    if (alias_code === localAliasKey) {
                        isMatch = true;
                        attribute = BaseEntityQuery.getAliasAttribute(localAlias[localAliasKey], attribute_code) || BaseEntityQuery.getBaseEntityAttribute(localAlias[localAliasKey], attribute_code);
                    
                    } else if (!isMatch) {
                        attribute = BaseEntityQuery.getAliasAttribute(alias_code, attribute_code) || BaseEntityQuery.getBaseEntityAttribute(alias_code, attribute_code);        
                    }
                })
                isMatch = null;
            } else {
                attribute = BaseEntityQuery.getAliasAttribute(alias_code, attribute_code) || BaseEntityQuery.getBaseEntityAttribute(alias_code, attribute_code);
            }
            if(attribute && attribute.value) {
                layout = JSON.parse(JSON.stringify(layout).replace(alias, attribute.value));
            }
         }
      });

      return layout;
  }

  getBaseEntityAttribute

  render() {

    const { layout, baseEntity, aliases } = this.props;

    let finalLayout = this.replaceAliasesIn(layout, aliases);
    return <JSONLoader layout={finalLayout} componentCollection={components} />;
  }
}

export default LayoutLoader;
