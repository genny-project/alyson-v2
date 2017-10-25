import React, { Component } from 'react';
import { object } from 'prop-types';
import LayoutNotFound from './layout-not-found';
import components from './components';
import { JSONLoader } from '@genny-project/layson';

class LayoutLoader extends Component {

  static propTypes = {
    layouts: object,
    baseEntity: object,
  };

  findAliasesIn(layout) {

      let aliases = [];
      if(layout instanceof Object) {
          Object.keys(layout).forEach(key => {

              let results = this.findAliasesIn(layout[key]);
              if(results instanceof Array) {
                  results.forEach(result => {
                     aliases.push(result);
                  });
              }
              else {
                  aliases.push(results);
              }
          });
      }
      else if (layout instanceof Array) {
          layout.forEach(value => {
              let results = this.findAliasesIn(value);
              if(results instanceof Array) {
                  results.forEach(result => {
                     aliases.push(result);
                  });
              }
              else {
                  aliases.push(results);
              }
          });
      }
      else if (typeof layout == "string") {
          return [layout];
      }

      return aliases;
  }

  replaceAliasesIn(layout) {

      let aliases = this.findAliasesIn(layout);
      aliases.forEach(alias => {

         // step1: check if string has format: "ALIAS.ATTRIBUTE"
         let split = alias.split(".");
         if(split.length == 2) {

            // step 2 is to check if split[0] is matching an alias within the store
            let alias_code = split[0];
            let aliases = this.props.baseEntity.aliases;
            let matchingAliases = Object.keys(aliases).filter(x => x == alias_code);
            if(matchingAliases.length > 0) {

                // step 3 is to check if split[0] is matching a base entity code within the store
                let be_code = aliases[matchingAliases[0]];
                let attribute_code = split[1];

                let baseEntities = this.props.baseEntity.data;
                let matchingEntities = Object.keys(baseEntities).filter(x => x == be_code);
                if(matchingEntities.length > 0) {

                    let be = baseEntities[matchingEntities[0]];

                    // step 4 is to do the same for attributes
                    let attributes = be.attributes;
                    let matchingAttributes = Object.keys(attributes).filter(x => x == attribute_code);
                    if(matchingAttributes.length > 0) {

                        let attribute = attributes[matchingAttributes[0]];
                        if(attribute.value) {
                            layout = JSON.parse(JSON.stringify(layout).replace(alias, attribute.value));
                        }
                    }
                }
            }
         }
      });

      return layout;
  }

  render() {
    const { layouts, baseEntity } = this.props;

    /* Get the current layout */
    const { current, loaded } = layouts;

    /* If the current layout is null or this layout hasn't been loaded display a LayoutNotFound page */
    if ( !current ) {
      return null;
    }

    if ( loaded[current] == null ) {
      return <LayoutNotFound layout={current} />;
    }

    let layout = this.replaceAliasesIn(loaded[current]);
    return <JSONLoader layout={layout} componentCollection={components} context={baseEntity.data} />;
  }
}

export default LayoutLoader;
