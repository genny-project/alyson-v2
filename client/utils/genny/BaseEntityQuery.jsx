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

  getChildren = (parentString) => {
    const relationshipData = this.entities.baseEntity.relationships;
    return relationshipData;
  }

  getRelationships = (code) => {
    console.log('Get relationships reached');
    console.log(code);
  }


  getRootChildren(code) {
    console.log(this.props.data.relationships, 'Loggin props from get entity children');
    let items = this.props.data.relationships ? Object.keys(this.props.data.relationships).map(key => this.props.data.relationships[key]) : [];
    console.log(items, 'Get entity children function from base entity query');

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
