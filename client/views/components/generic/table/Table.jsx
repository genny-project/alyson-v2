import 'react-table/react-table.css';
import './table.scss';
import React, { Component } from 'react';
import { string, array, object } from 'prop-types';
import ReactTable from 'react-table';

class Table extends Component {

  static defaultProps = {
    className: '',
    columns: {},
    data: {},

  }

  static propTypes = {
    className: string,
    columns: object,
    data: object,
  }

  state = {

  }

  render() {
    const { className, columns, data, itemsPerPage } = this.props;

    return (
      <ReactTable
        data={data}
        columns={columns}
        defaultPageSize={itemsPerPage}
        className="-striped -highlight table"
      />
    );
  }
}

export default Table;
