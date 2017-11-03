import './list.scss';
import React, { Component } from 'react';
import { string, object, array, number } from 'prop-types';
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
    itemsPerPage: number
  }

  state = {
  }

  render() {
 	  const { className, style, data, columns, itemsPerPage } = this.props;
    const {  } = this.state;
    const componentStyle = { ...style, };
    return (
      <div className={`list ${className}`}>
        <Table
          data={data}
          columns={columns}
          itemsPerPage={itemsPerPage}
        />
      </div>
    );
  }
}

export default List;
