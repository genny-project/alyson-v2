import React, { Component } from 'react';


class BaseEntityQuery extends Component {
  constructor(entities) {
    super(entities);
    this.entities = entities;
  }


  getChildren = (parentString) => {
    const relationshipData = this.entities.baseEntity.relationships;
    return relationshipData;
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

export default BaseEntityQuery;
