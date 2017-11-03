import 'react-table/react-table.css';
import './table.scss';
import React, { Component } from 'react';
import { string, array, object, number, } from 'prop-types';
import ReactTable from 'react-table';

class Table extends Component {

  static defaultProps = {
    className: '',
    columns: [],
    data: [],

  }

  static propTypes = {
    className: string,
    columns: array,
    data: array,
    itemsPerPage: number,
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
        style={{ height: "400px" }}
      />
    );
  }
}

export default Table;
