import './list.scss';
import React, { Component } from 'react';
import { string, object, array, number, func } from 'prop-types';
import { Table } from '../';

class List extends Component {

  static defaultProps = {
    className: '',
    itemsPerPage: 3,
    getThProps: {},
  }

  static propTypes = {
    className: string,
    style: string,
    columns: array,
    data: array,
    itemsPerPage: number,
    thStyle: object
  }

  state = {
  }

  render() {
 	  const { className, style, data, columns, itemsPerPage, thStyle } = this.props;
    const {  } = this.state;
    const componentStyle = { ...style, };
    return (
      <div className={`list ${className}`}>
        <Table
          thStyle={thStyle}
          data={data}
          columns={columns}
          itemsPerPage={itemsPerPage}
        />
      </div>
    );
  }
}

export default List;
