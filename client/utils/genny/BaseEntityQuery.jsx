import React, { Component } from 'react';
import { connect } from 'react-redux';

class BaseEntityQuery extends Component {
  constructor(entities) {
    super(entities);
    this.entities = entities;
    console.log('baeentity data log from base entity query ', this.props);
  }

  getChildren = (parentString) => {
    const relationshipData = this.entities.baseEntity.relationships;
    return relationshipData;
  }

  getRelationships = (code) => {
    console.log('GEt relationships reached');
    console.log(code);
  }



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
