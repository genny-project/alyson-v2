import 'react-table/react-table.css';
import './table.scss';
import React, { Component } from 'react';
import { string, array, number, bool, } from 'prop-types';
import ReactTable from 'react-table';

class Table extends Component {

  static defaultProps = {
    className: '',
    columns: [],
    data: [],
    list: false
  }

  static propTypes = {
    className: string,
    columns: array,
    data: array,
    itemsPerPage: number,
    isList: bool,
  }

  createProps = key => (state, rowInfo, column) => {
    if ( !this.props.isList )
      return {};

    const props = {
      tHeadStyle: { style: { display: 'none' }},
      tdStyle: { style: { height: 'initial', padding: 0, margin: 0, flexGrow: 0, background: 'none' }},
      trStyle: { style: { height: 'initial', padding: 0, margin: 0, flexGrow: 0 }},
      trGroupStyle: { style: { height: 'initial', padding: 0, margin: 0, flexGrow: 0, marginBottom: '10px', border: 'none', }},
      tBodyStyle: { style: { flexGrow: 0 }},
      tHeadStyle: { style : { textAlign: 'left' }},
      tableStyle: { className: 'hello', style: { flex: 'initial' }},
      paginateStyle: { style: { background: 'red' }},
      tHeadFilterStyle: { style : { display: "none" }},
    }
    return props[key];
  }

  render() {
    const { className, columns, data, itemsPerPage, isList, } = this.props;
    
    return (
      <ReactTable
        getTdProps={this.createProps( 'tdStyle' )}
        getTrProps={this.createProps( 'trStyle' )}
        getTrGroupProps={this.createProps( 'trGroupStyle' )}
        getTbodyProps={this.createProps( 'tBodyStyle' )}
        getTableProps={this.createProps( 'tableStyle' )}
        getPaginationProps={this.createProps( 'paginateStyle' )}
        getTheadFilterProps={this.createProps( 'tHeadFilterStyle' )}
        getTheadProps={this.createProps( 'tHeadStyle' )}
        showPageSizeOptions={false}
        data={data}
        columns={columns}
        defaultPageSize={itemsPerPage}
        className={`table -striped -highlight ${isList ? 'table-list' : null } `}
      />
    );
  }
}

export default Table;
