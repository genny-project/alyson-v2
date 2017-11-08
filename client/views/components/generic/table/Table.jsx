import 'react-table/react-table.css';
import './table.scss';
import React, { Component } from 'react';
import { string, array, object, number, func, } from 'prop-types';
import ReactTable from 'react-table';

class Table extends Component {

  static defaultProps = {
    className: '',
    columns: [],
    data: [],
    thStyle: {},
    tdStyle: {}, 
    trStyle: {}, 
    trGroupStyle: {},
    tBodyStyle: {}, 
    tableStyle: {},
  }

  static propTypes = {
    className: string,
    columns: array,
    data: array,
    itemsPerPage: number,
    thStyle: object,
    tdStyle: object, 
    trStyle: object, 
    trGroupStyle: object,
    tBodyStyle: object, 
    tableStyle: object,
  }

  state = {

  }

  render() {
    const { className, columns, data, itemsPerPage, thStyle, tdStyle, trStyle, trGroupStyle, tBodyStyle, tableStyle, } = this.props;
    return (
      <ReactTable
        
        getTheadProps={(state, rowInfo, column) => { return { style: thStyle } }}
        getTdProps={(state, rowInfo, column) => { return { style: tdStyle } }}
        getTrProps={(state, rowInfo, column) => { return { style: trStyle } }}
        getTrGroupProps={(state, rowInfo, column) => { return { style: trGroupStyle } }}
        getTbodyProps={(state, rowInfo, column) => { return { style: tBodyStyle } }}
        getTableProps={(state, rowInfo, column) => { return { style: tableStyle } }}
        data={data}
        columns={columns}
        defaultPageSize={itemsPerPage}
        className="table -striped -highlight"
      />
    );
  }
}

export default Table;
