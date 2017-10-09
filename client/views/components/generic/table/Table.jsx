import './table.scss';
import React, { Component }  from 'react';
import { } from '../';
import { string, array, object } from 'prop-types';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class Table extends Component {

  static defaultProps = {
    className: '',
    tableData: {},

  }

  static propTypes = {
    className: string,
    tableData: object,
  }

  state = {

  }

  render() {
 	  const { className, tableData  } = this.props;
    const data = tableData.data;
    const columns = tableData.columns;
    const itemsPerPage = tableData.itemsPerPage;

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
