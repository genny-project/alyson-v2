import React, { Component } from 'react';
import { connect } from 'react-redux';

class BaseEntityQuery extends Component {
  constructor(props) {
    super(props);
    console.log(props, 'log props from baseentity query');
    // this.entities = entities;
    // console.log('baeentity data log from base entity query ', this.entities);
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

  // Get children of a specific code 

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


  getRelationships(entity_code) {

  }



  // getEntityChildren(code) {
  //   console.log(this.props.data.relationships, 'Loggin props from get entity children');
  //   let items = this.props.data.relationships ? Object.keys(this.props.data.relationships).map(key => this.props.data.relationships[key]) : [];
  //   console.log(items, 'Get entity children function from base entity query');
  //   const { baseEntity } = this.props;
  //   console.log(baseEntity, 'log baseentity props from baseentityquery');

  //   const relationships = baseEntity.relationships[code];
  //   let items = relationships ? Object.keys(relationships).filter(key => relationships[key]).map(code => baseEntity.data[code].data) : [];

  //   items = items.map(item => {
  //     /* Get the children for this item */
  //     const children = this.getEntityChildren(item.code);
  //     item.children = children;
  //     item.open = !!this.state.tree[item.code];
  //     return item;
  //   });

  //   console.log('Items from base entity query ', items);
  //   return items;

  // }





  render() {
    console.log(this.getChildren());
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
