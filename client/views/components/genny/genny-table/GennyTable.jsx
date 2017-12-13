import './gennyTable.scss';
import React, { Component } from 'react';
import { Table } from 'views/components';
import { object, array, bool } from 'prop-types';
import { BaseEntityQuery } from 'utils/genny';
import { IconSmall } from 'views/components';
import { GennyBridge } from 'utils/genny';
import { GennyTableHeader, GennyTableEditableCell, GennyTableCell, GennyTableCellMobile } from './genny-table-components';

class GennyTable extends Component {

    static defaultProps = {
        showBaseEntity: false
      }

      static propTypes = {
        showBaseEntity: bool,
      }

    state = {
        columns: [],
        data: [],
        width: null,
        height: null,
        isOpen: {},
        isMobile: window.getScreenSize() == 'sm'
    }

    generateColumns = (baseEntity) => {

        const { showBaseEntity } = this.props;
        const { isMobile } = this.state;
        let cols = [];
        let attributes = baseEntity.attributes;
        if(attributes) {

            if(showBaseEntity) {

                cols.push({
                    "Header": <span className="header-single-table">{baseEntity.name}</span>,
                    "columns": [
                        {
                            "Header": <span className="header-single">ATTRIBUTE CODE</span>,
                            "accessor": 'code',
                            "Cell": ({row, original}) => <GennyTableCell original={original} value={row.code} />
                        },
                        {
                            "Header": <span className="header-single">VALUE</span>,
                            "accessor": 'value',
                            "Cell": ({row, original}) => <GennyTableCell original={original} value={row.value} />
                        },
                        {
                            "Header": <span className="header-single">WEIGHT</span>,
                            "accessor": 'weight',
                            "Cell": ({row, original}) => <GennyTableCell original={original} value={row.weight} />
                        }
                    ]
                });

            } else {

                Object.keys(attributes).forEach(attribute_key => {

                    let attribute = attributes[attribute_key];
                    let headers = cols.map(column => {
                        return column.attributeCode;
                    });

                    if(!headers.includes(attribute.attributeCode)) {

                        let newCol = {
                            "attributeCode": attribute.attributeCode
                        };

                        if(!isMobile) {
                            newCol.Header = <GennyTableHeader title={attribute.attribute.name}/>;
                            newCol.Cell = (cellInfo) => <GennyTableEditableCell data={this.state.data} cellInfo={cellInfo} />;
                            newCol.accessor = attribute.attribute.name;
                        }
                        else {
                            newCol.name = attribute.attribute.name;
                        }

                        cols.push(newCol);
                    }
                });
            }
        }

        return cols;
    }

    generateHeadersFor(baseEntities) {

        const { showBaseEntity } = this.props;
        const isMobile = this.state.isMobile;
        let tableColumns = baseEntities.map(baseEntity => this.generateColumns(baseEntity))[0];
        let mobileColumns = [];

        if(!showBaseEntity && isMobile) {

            if(tableColumns.length > 0) {

                mobileColumns.push({
                    "Header": <GennyTableHeader title={tableColumns[0].attributeCode} />,
                    "accessor": tableColumns[0].attributeCode,
                    "Cell": ({row, original}) => <GennyTableCellMobile data={tableColumns} row={row} original={original} />
                });
            }
        }

        this.state.columns = isMobile ? mobileColumns : tableColumns;
        return isMobile ? mobileColumns : tableColumns;
    }

    generateDataFor(baseEntities) {

        const { showBaseEntity} = this.props;

        let data = []
        baseEntities.forEach(baseEntity => {

            if(baseEntity.attributes) {

                let newData = {}

                Object.keys(baseEntity.attributes).forEach(attribute_key => {

                    let attribute = baseEntity.attributes[attribute_key];

                    if(showBaseEntity) {

                        if(attribute.value) {

                            data.push({
                                code: attribute.attributeCode,
                                value: attribute.value,
                                weight: attribute.weight,
                                inferred: attribute.inferred,
                            })
                        }
                    }
                    else {

                        let attribute = baseEntity.attributes[attribute_key];
                        newData[attribute.attribute.name] = attribute.value;
                        newData["baseEntityCode"] = attribute.baseEntityCode;
                        newData["validationList"] = {
                            ...newData["validationList"],
                            [attribute.attributeCode]: attribute.attribute.dataType.validationList
                        };
                    }
                });

                if(!showBaseEntity) {
                    data.push(newData)
                }
            }
        });

        this.state.data = data;
        return data;
    }

    render() {

        const { root, showBaseEntity, style } = this.props;

        let columns = [];
        let data = [];

        let children = BaseEntityQuery.getEntityChildren(root);

        if(showBaseEntity) {
            let be = BaseEntityQuery.getBaseEntity(root);
            if(be) {
                children = [be];
            }
        }

        columns = this.generateHeadersFor(children);
        data = this.generateDataFor(children)
        return (
            <div className={`genny-table ${data.length ? null : 'empty'}`} style={style}>
                <Table {...this.props} data={data} columns={columns} />
            </div>
        );
    }
}

export default GennyTable;
