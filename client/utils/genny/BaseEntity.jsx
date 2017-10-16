import React, { Component } from 'react';
import { connect } from 'react-redux';
import BaseEntityQuery from './BaseEntityQuery';

class BaseEntity extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return this.props.children(new BaseEntityQuery(this.props));
  }
}

const mapStateTopProps = (state) => ({
  baseEntities: state.baseEntity
});


// export default BaseEntity;
export default connect(mapStateTopProps, null)(BaseEntity);
