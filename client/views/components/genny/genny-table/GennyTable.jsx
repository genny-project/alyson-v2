import './gennyTable.scss';
import React, { Component } from 'react';
import { Table } from '../../';
import { object, array } from 'prop-types';
import BaseEntityQuery from './../../../../utils/genny/BaseEntityQuery';

class GennyTable extends Component {

  static propTypes = {
  };

  state = {
      columns: [],
      data: []
  }

  generateHeadersFor(baseEntities) {

    let columns = [];

    baseEntities.forEach(baseEntity => {

        let attributes = baseEntity.attributes;
        if(attributes) {

            attributes.forEach(attribute => {

                // we loop through the headers. If the header already exists we skip, otherwise we add it
                let headers = columns.map(column => {
                    return column.Header;
                });

                if(!headers.includes(attribute.name)) {
                    columns.push({
                        "Header": attribute.name,
                        "accessor": attribute.name,
                        "Cell": this.renderEditable
                    });
                }
            });
        }
    });

    this.state.columns = columns;
    return columns;
  }

  generateDataFor(baseEntities) {

      let data = [];
      let columns = this.state.columns;
      baseEntities.forEach(baseEntity => {

          if(baseEntity.attributes) {

              let newData = {}
              baseEntity.attributes.forEach(attribute => {
                  newData[attribute.name] = attribute.value;
              });

              data.push(newData);
          }
      });

      this.state.data = data;
      return data;
  }

  renderEditable = (cellInfo) => {

      return (
          <div
              contentEditable
              suppressContentEditableWarning
              onBlur={e => {
                  console.log(e.target);
              }}
              dangerouslySetInnerHTML={{
                  __html: this.state.data[cellInfo.index][cellInfo.column.id]
              }}
          />
      );
  }

  render() {

    const { root } = this.props;

    let query = new BaseEntityQuery(this.props);
    let columns = [];
    let data = [];

    let children = query.getEntityChildren(root);
    if(children) {

        columns = this.generateHeadersFor(children);
        data = this.generateDataFor(children);
    }

    return (
      <div className="genny-table">
        <Table {...this.props} data={data} columns={columns} />
      </div>
    );
  }
}

export default GennyTable;
