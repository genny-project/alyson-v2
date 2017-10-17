import './gennyTable.scss';
import React, { Component } from 'react';
import { Table } from '../../';
import { object, array } from 'prop-types';

class GennyTable extends Component {

  static propTypes = {
  };

  state = {
  }

  render() {
    const {  } = this.props;

    return (
      <div className="genny-table">
        <Table />
      </div>
    );
  }
}

export default GennyTable;
