import React, { Component } from 'react';
import { connect } from 'react-redux';

class BaseEntityQuery extends Component {

  constructor(props) {
    super(props);
  }


  helloWorld = (code) => {
  }

  getChildrens = () => {
    const entities = this.props.baseEntities.data;
    const entitiesArr = Object.keys(entities).map(key => entities[key]);
    // return entitiesArr;
  }

  // Get the Roots Children
  getRootChildren() {

    let items = this.props.baseEntities.relationships ? Object.keys(this.props.baseEntities.relationships).map(key => this.props.baseEntities.relationships[key]) : [];
  }

  getChildrenOf(entity_code) {
    let items = this.props.baseEntities.data;
    const itemsArr = Object.keys(items).map(key => items[key]);
    itemsArr.map(item => {

      if (item.code === entity_code) {
        // return item.data.children;
      }
      else {
        // return [];
      }
    });
  }

  getAlias = (code) => {

    let layout = [];

    // check aliases if any for passed entities
    for (let entity_code_key in code) {

      let baseEntities = this.props.baseEntities.data;
      for (let key in baseEntities) {

        // if we find the base entity we are looking for
        if (key === entity_code_key) {

          // we loop through all the attributes to find the ones we want
          code[entity_code_key].forEach(attribute => {

            let be = this.props.baseEntities.data[key];

            // we loop through attributes
            be.attributes.forEach(be_attribute => {

              if (be_attribute.code === attribute) {
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
