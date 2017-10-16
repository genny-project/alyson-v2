import React, { Component } from 'react';
import { connect } from 'react-redux';

class BaseEntityQuery extends Component {

  constructor(entities) {
    super(entities);
    this.entities = entities;
  }


  helloWorld = (code) => {
    console.log('Testing hello world from base entity query');
  }

  getChildrens = () => {
    const entities = this.props.data.data;
    const entitiesArr = Object.keys(entities).map(key => entities[key]);
    console.log(entitiesArr, 'entitites array in getChildrens');
    // return entitiesArr;
  }


  // Get the Roots Children
  getRootChildren() {
    let items = this.props.data.relationships ? Object.keys(this.props.data.relationships).map(key => this.props.data.relationships[key]) : [];
    console.log(this.props.data.relationships, 'Loggin props from get root of children');
  }

  getChildrenOf(entity_code) {
    let items = this.props.data.data;
    const itemsArr = Object.keys(items).map(key => items[key]);
    console.log(itemsArr, 'Log items array from getChildrenOf');
    itemsArr.map(item => {
      if (item.data.code === entity_code) {
        console.log(item.data.children, 'Log from getChildrenOf');
        // return item.data.children;
      }
      else {
        console.log([]);
        // return [];
      }
    });
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
