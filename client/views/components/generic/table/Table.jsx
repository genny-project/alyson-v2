import './table.scss';
import React, { Component }  from 'react';
import { } from '../';
import { string, object } from 'prop-types';

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

  renderCols = (cols) => {

    let layout = [];
    cols.map((header, i) => {
    
      layout.push(
        <div key={i} className="table-header-cell" >{header.name}</div>
      );
    });

    return layout;
  }

  renderRows = (data) => {
    
    let layout = [];
    data.map((row, i) => {
  
    //row.X needs to be taken from renderCols header.name

    layout.push(
      <div key={i} className="table-row" >
        <div className="table-row-cell" >{row.firstName}</div>
        <div className="table-row-cell" >{row.lastName}</div>
      </div>);
    });
    console.log(layout);
    return layout;
  }

  render() {
 	  const { className, tableData } = this.props;
    const {  } = this.state;
    
    console.log(tableData);

    const cols = tableData.col;
    const data = tableData.data;
    console.log(cols);
    console.log(data);

    return (
      <div className="table">
        <div className="table-header" >
          {this.renderCols(cols)}
        </div>
        {this.renderRows(data)}
      </div>
    );
  }
}

export default Table;
