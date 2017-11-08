import './list.scss';
import React, { Component } from 'react';
import { string, object, array, number, func } from 'prop-types';
import { Table } from '../';

class List extends Component {

  static defaultProps = {
    className: '',
    itemsPerPage: 3,
  }

  static propTypes = {
    className: string,
    style: string,
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
 	  const { className, style, data, columns, itemsPerPage, thStyle, tdStyle, trStyle, trGroupStyle, tBodyStyle, tableStyle, } = this.props;
    const {  } = this.state;
    const componentStyle = { ...style, };
    return (
      <div className={`list ${className}`}>
        <Table
          thStyle={thStyle}
          tdStyle={tdStyle} 
          trStyle={trStyle} 
          trGroupStyle={trGroupStyle}
          tBodyStyle={tBodyStyle} 
          tableStyle={tableStyle} 
          data={data}
          columns={columns}
          itemsPerPage={itemsPerPage}
        />
      </div>
    );
  }
}

export default List;
