import React, { Component } from 'react';
import { connect } from 'react-redux';
import BaseEntityQuery from './BaseEntityQuery';

class BaseEntity extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.children(new BaseEntityQuery(this.props.data));
  }
}



const mapStateTopProps = (state) => ({
  data: state.baseEntity
});


export default connect(mapStateTopProps, null)(BaseEntity);
