import React, { Component } from 'react';


class BaseEntityQuery extends Component {
  constructor(entities) {
    super(entities);
    this.entities = entities;
  }


  getCode = () => {

  }

  getparent = (child) => {

  }

  getChildren = (parentString) => {
    return this.entities.baseEntity.relationships;
  }


  render() {

    return <h1> Hello there</h1>;
  }


}

export default BaseEntityQuery;
