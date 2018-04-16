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

  shouldComponentUpdate() {
      return true;
  }

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

          let splitValue = '';
          let toBeReplacedAlias = alias;

          if(alias.includes("${")) {

              const regex = /[$][{](.*?)[}]/;
              const v = regex.exec(alias);

              if(v != null) {
                  if(v[1] != null) {
                      splitValue = v[1];
                      toBeReplacedAlias = v[0];
                  }
              }
          }
          else {
              splitValue = alias;
          }

          splitValue = splitValue.split('.');
          let alias_code = splitValue[0];
          let attribute_code = splitValue[1];

          let attribute = {};

          if (localAliases) {

             Object.keys(localAliases).forEach((alias_key) => {

                 let localAliasCode = localAliases[alias_key];

                 if(alias_key == alias_code) {

                      let baseEntity = BaseEntityQuery.getBaseEntity(localAliasCode);

                      if(baseEntity) {

                          // i am so sorry
                          if(attribute_code == 'created') {
                              attribute = {
                                  value: BaseEntityQuery.getBaseEntityField(localAliasCode, 'created')
                              };
                          }
                          else if(attribute_code == "code") {
                              attribute = {
                                  value: BaseEntityQuery.getBaseEntityField(localAliasCode, 'code')
                              };
                          }
                          else if(attribute_code == "links") {

                              const linkValue = splitValue[2];
                              const be_attribute = splitValue[3];

                              if(linkValue != null && be_attribute != null) {

                                  const linkedBaseEntity = BaseEntityQuery.getLinkedBaseEntity(localAliasCode, linkValue);

                                  if(linkedBaseEntity != null) {

                                      if(be_attribute == 'created') {
                                          attribute = {
                                              value: BaseEntityQuery.getBaseEntityField(linkedBaseEntity.code, 'created')
                                          };
                                      }
                                      else if(be_attribute == "code") {
                                          attribute = {
                                              value: BaseEntityQuery.getBaseEntityField(linkedBaseEntity.code, 'code')
                                          };
                                      }
                                      else {
                                          attribute = BaseEntityQuery.getBaseEntityAttribute(linkedBaseEntity.code, be_attribute);
                                      }
                                  }
                              }
                          }
                          // else if(attribute_code == "links") {

                          // }
                          else {
                              attribute = splitValue.length == 2 ? BaseEntityQuery.getBaseEntityAttribute(localAliasCode, attribute_code) : null;
                          }

                          if(attribute == null && attribute_code != null && (splitValue.length == 2 || splitValue.length == 4)) {
                              layout = JSON.parse(JSON.stringify(layout).replace(toBeReplacedAlias, ''));
                          }
                          else if(alias_code == "ROOT") {
                              layout = JSON.parse(JSON.stringify(layout).replace(toBeReplacedAlias, baseEntity.code));
                          }
                     }
                  }
              });
          }

          if(!localAliases || alias_code == 'USER' || alias_code == 'PROJECT') {

              if(splitValue.length == 2) {

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
              try {

                  if(layout != null) {

                      let stringified = JSON.stringify(layout);
                      if(stringified != null) {

                          stringified = stringified.replace(toBeReplacedAlias, attribute.value);
                          if(stringified != null) {
                              stringified = stringified.replace(/(\r\n|\n|\r)/gm, '<br>');
                              if(stringified != null) {
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
    // finalLayout = this.hideAliasesIn( finalLayout );
    return <JSONLoader layout={finalLayout} componentCollection={components} />;
  }
}

export default LayoutLoader;
