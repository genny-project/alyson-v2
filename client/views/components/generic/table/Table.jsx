import 'react-table/react-table.css';
import './table.scss';
import React, { Component } from 'react';
import { string, array, number, bool, } from 'prop-types';
import ReactTable from 'react-table';
import { IconSmall, } from '../../';

class Table extends Component {

  static defaultProps = {
    className: '',
    columns: [],
    data: [],
    list: false,
    itemsPerPage: 20,
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
      tHeadStyle: { style : { textAlign: 'left', marginBottom: '10px' }},
      tableStyle: { style: { flex: 'initial' }},
      paginateStyle: { className: 'list-pagination' },
      tHeadFilterStyle: { style : { display: "none" }},
      noDataStyle: { className: 'no-data' },
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
        PreviousComponent={(props) => (
          <IconSmall {...props} className='table-prev' name='chevron_left' />
        )}
        NextComponent={(props) => (
          <IconSmall {...props} className='table-next' name='chevron_right' />
        )}
        noDataText='No data to display.'
        data={data}
        columns={columns}
        defaultPageSize={itemsPerPage}
        className={`table -striped -highlight ${isList ? 'table-list' : null } `}
        showPagination={ data.length > itemsPerPage ? true : false}
       
      />
    );
  }
}

export default Table;
