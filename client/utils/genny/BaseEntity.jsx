import React, { Component } from 'react';
import { connect } from 'react-redux';
import BaseEntityQuery from './BaseEntityQuery';
class BaseEntity extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // return this.props.children({
    //   test: true,
    //   matt: 'hayward',
    //   gerard: 'holland'
    // });

    return this.props.children(new BaseEntityQuery(this.props));
    // return <h2> sfdsfsfs </h2>;
  }
}


const mapStateTopProps = (state) => ({
  data: state.baseEntity
});


// export default BaseEntity;
export default connect(mapStateTopProps, null)(BaseEntity);
