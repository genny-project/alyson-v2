import './gennyTable.scss';
import React, { Component } from 'react';
import { Table } from '../../';
import { object, array } from 'prop-types';

class GennyTable extends Component {

  static propTypes = {
  };

  state = {
  }

  render() {

    const { baseEntity, asks } = this.props;

    // data
    // columns

    // name of the ask = name of column
    // question.attributeCode = value to display
    // { "firstName" : "4office", "lastName": "5photo", "age": 344, "visits": 13, "progress": 23, "status" : "tbool" }
    // { "Header": "Last Name", "accessor": "lastName" }

    let columns = [

        {
            "Header": "Attribute Code",
            "accessor": "code"
        },
        {
            "Header": "Attribute Value",
            "accessor": "value"
        }
    ];

    let data = [];
    let be = baseEntity.data["PER_USER1"] || {}; 
    let be_attributes = be.attributes || [];
    be_attributes.forEach(attribute => {

        data.push({
            "code": attribute.code,
            "value": attribute.value
        });
    });

    return (
      <div className="genny-table">
        <Table {...this.props} data={data} columns={columns} />
      </div>
    );
  }
}

export default GennyTable;
