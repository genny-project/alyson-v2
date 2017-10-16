import React, { Component } from 'react';
import { connect } from 'react-redux';

class BaseEntityQuery extends Component {
  constructor(entities) {
    super(entities);
    this.entities = entities;
  }

  getChildren = (parentString) => {
    const relationshipData = this.entities.baseEntity.relationships;
    return relationshipData;
  }

  getRelationships = (code) => {
    // console.log('GEt relationships reached');
    // console.log(code);
  }

  getAlias = (code) => {

      let layout = [];

      // check aliases if any for passed entities
      for (let entity_code_key in code) {

          let baseEntities = this.entities.baseEntities.data;
          for(let key in baseEntities) {

              // if we find the base entity we are looking for
              if(key === entity_code_key) {

                  // we loop through all the attributes to find the ones we want
                  code[entity_code_key].forEach(attribute => {

                      let be = this.entities.baseEntities.data[key];

                      // we loop through attributes
                      be.attributes.forEach(be_attribute => {

                          if(be_attribute.code === attribute) {
                              layout.push(
                                  <p>{be_attribute.value}</p>
                              );
                          }
                      });
                  });
              }
          }
      }

      return layout;
  }

  render() {
    // console.log(this.getChildren());
    return (
      <div>
        <h1> Base entity query element </h1>
      </div>
    );
  }
}

const mapStateTopProps = (state) => ({
  data: state.baseEntity
});

export default BaseEntityQuery;
