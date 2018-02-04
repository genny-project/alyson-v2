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

        let attribute = {};

        if (localAliases) {

           Object.keys(localAliases).forEach((alias_key) => {

               let localAliasCode = localAliases[alias_key];

               if(alias_key == alias_code) {

                   let baseEntity = BaseEntityQuery.getBaseEntity(localAliasCode);

                    if(baseEntity) {

                        if(attribute_code != null && attribute_code.startsWith('PRI_')) {
                            attribute = split.length == 2 ? BaseEntityQuery.getBaseEntityAttribute(localAliasCode, attribute_code) : null;
                        }
                        else if(attribute_code != null) {
                            attribute = split.length == 2 ? BaseEntityQuery.getBaseEntityField(localAliasCode, attribute_code) : null;
                        }

                        if(attribute == null) {
                            layout = JSON.parse(JSON.stringify(layout).replace(alias, baseEntity.code));
                        }
                   }
                }
            });
        }

        if(!localAliases || alias_code == 'USER' || alias_code == 'PROJECT') {

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

        if(attribute != null && attribute.value != null ) {
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
