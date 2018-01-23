import React, { Component } from 'react';
import { object } from 'prop-types';
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
      else if (typeof layout == 'string') {
          return [layout];
      }

      return layoutValues;
  }

  replaceAliasesIn(layout, localAliases) {

      let aliases = this.getLayoutValues(layout);
      aliases.forEach(alias => {

        let split = alias.split('.');
        let alias_code = split[0];
        let attribute_code = split[1];

        let showLog = attribute_code ? (attribute_code.includes('PRI_DRIVER') || attribute_code.includes('PRI_OWNER')) : false;

        let attribute = {};

        if (localAliases) {

           Object.keys(localAliases).forEach((alias_key) => {

               let localAliasCode = localAliases[alias_key];

               if(showLog) console.log('localAliases', localAliases);
               if(showLog) console.log('alias_code', alias_code);
               if(showLog) console.log('baseEntityCode', localAliasCode);

               if(alias_key == alias_code) {

                   let baseEntity = BaseEntityQuery.getBaseEntity(localAliasCode);

                   if(showLog) console.log('baseEntity', baseEntity);

                   if(baseEntity) {

                       attribute = split.length == 2 ? BaseEntityQuery.getBaseEntityAttribute(localAliasCode, attribute_code) : null;
                       if(attribute == null) {
                           layout = JSON.parse(JSON.stringify(layout).replace(alias, baseEntity.code));
                       }
                   }
                }
            });
        }
        else {

            if(split.length == 2) {
                attribute = BaseEntityQuery.getAliasAttribute(alias_code, attribute_code) || BaseEntityQuery.getBaseEntityAttribute(alias_code, attribute_code);

                if(attribute == null) {

                    let baseEntity = BaseEntityQuery.getAlias(alias_code);

                    if(baseEntity) {
                        attribute = {
                            value: baseEntity.code
                        };
                    }
                }
            }
        }

        if(attribute && attribute.value != null ) {
            layout = JSON.parse(JSON.stringify(layout).replace(alias, attribute.value));
        }

      });

      return layout;
  }

  hideAliasesIn(layout) {
    if ( layout && process.env.NODE_ENV === 'production' ) {
      const layoutString = JSON.stringify( layout ).replace( /\"PROJECT\.[^\"]*\"/g, '\"\"' ).replace( /\"USER\.[^\"]*\"/g, '\"\"' ).replace( /\"BE\.[^\"]*\"/g, '\"\"' );
      layout = JSON.parse( layoutString );
    }

    return layout;
    //return JSON.parse(JSON.stringify( layout ).replace(/\"BE\..*\"/g, ''));
  }

  render() {
    const { layout, aliases } = this.props;

    let finalLayout = this.replaceAliasesIn(layout, aliases);
    finalLayout = this.hideAliasesIn( finalLayout );
    return <JSONLoader layout={finalLayout} componentCollection={components} />;
  }
}

export default LayoutLoader;
