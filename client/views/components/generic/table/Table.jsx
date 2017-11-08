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
  }

  static propTypes = {
    className: string,
    columns: array,
    data: array,
    itemsPerPage: number,
    thStyle: object,
  }

  state = {

  }

  render() {
    const { className, columns, data, itemsPerPage, thStyle } = this.props;
    return (
      <ReactTable
        
        getTheadProps={(state, rowInfo, column) => {
          return {
            style: thStyle 
          }
        }}
        {/*getTdProps={(state, rowInfo, column) => {
          return {
            style: {height: 'initial', padding: 0, margin: 0, flexGrow: 0} 
          }
        }}
        getTrProps={(state, rowInfo, column) => {
          return {
            style: {height: 'initial', padding: 0, margin: 0, flexGrow: 0} 
          }
        }}
        getTrGroupProps={(state, rowInfo, column) => {
          return {
            style: {height: 'initial', padding: 0, margin: 0, flexGrow: 0, marginBottom: '10px', border: 'none'} 
          }
        }}
        getTbodyProps={(state, rowInfo, column) => {
          return {
            style: { flexGrow: 0} 
          }
        }}
        getTableProps={(state, rowInfo, column) => {
          return {
            style: { flex: 'initial'} 
          }
        }}*/}
        data={data}
        columns={columns}
        defaultPageSize={itemsPerPage}
        className="table -striped -highlight"
        style={{ height: "400px" }}
      />
    );
  }
}

export default Table;
