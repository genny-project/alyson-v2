import './gennyTable.scss';
import React, { Component } from 'react';
import { object, array, bool } from 'prop-types';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';
import { IconSmall, Table } from 'views/components';
import { GennyTableHeader, GennyTableEditableCell, GennyTableCell, GennyTableCellMobile } from './genny-table-components';

class GennyTable extends Component {

    static defaultProps = {
        showBaseEntity: false,
        columns: null
      }

      static propTypes = {
        showBaseEntity: bool,
        columns: []
      }

    state = {

        data: [],
        width: null,
        height: null,
        isOpen: {},
        isMobile: window.getScreenSize() == 'sm'
    }

    generateHeadersFor(baseEntities) {

        const { showBaseEntity } = this.props;
        const isMobile = this.state.isMobile;

        let tableColumns = [];
        let headers = [];

        baseEntities.map(baseEntity => {

            let cols = this.generateColumns(baseEntity);
            cols.map(c => {

                if( !headers.includes(c.attributeCode) ) {
                    headers.push(c.attributeCode);
                    tableColumns.push(c);
                }
            });
        });

        let mobileColumns = [];

        if(!showBaseEntity && isMobile) {

            if(tableColumns.length > 0) {

                mobileColumns.push({
                    'Header': <GennyTableHeader title={tableColumns[0].attributeCode} />,
                    'accessor': tableColumns[0].attributeCode,
                    'Cell': ({row, original}) => <GennyTableCellMobile data={tableColumns} row={row} original={original} />
                });
            }
        }

        this.state.columns = isMobile ? mobileColumns : tableColumns;
        return isMobile ? mobileColumns : tableColumns;
    }

    generateColumns = (baseEntity) => {

        const { showBaseEntity, linkCode } = this.props;
        const { isMobile } = this.state;
        let cols = [];

        if(showBaseEntity) {

            cols.push({
                'Header': <span className="header-single-table">{baseEntity.name}</span>,
                'columns': [
                    {
                        'Header': <span className="header-single">ATTRIBUTE CODE</span>,
                        'accessor': 'code',
                        'Cell': ({row, original}) => <GennyTableCell original={original} value={row.code} />
                    },
                    {
                        'Header': <span className="header-single">VALUE</span>,
                        'accessor': 'value',
                        'Cell': ({row, original}) => <GennyTableCell original={original} dataType={original.type} value={row.value} />
                    },
                    {
                        'Header': <span className="header-single">WEIGHT</span>,
                        'accessor': 'weight',
                        'Cell': ({row, original}) => <GennyTableCell original={original} value={row.weight} />
                    }
                ]
            });

        } else {

            let attributes = baseEntity.attributes;

            if(attributes) {

                Object.keys(attributes).sort((x,y) => attributes[x].weight > attributes[y].weight).forEach(attribute_key => {

                    let attribute = attributes[attribute_key];

                    let headers = cols.map(column => {
                        return column.attributeCode;
                    });

                    if(!headers.includes(attribute.attributeCode)) {

                        let newCol = {
                            'attributeCode': attribute.attributeCode
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

    generateDataFor(baseEntities) {

        const { showBaseEntity } = this.props;

        let data = [];

        baseEntities.forEach(baseEntity => {

            if(baseEntity.attributes) {

                let newData = {};

                Object.keys(baseEntity.attributes).forEach(attribute_key => {

                    let attribute = baseEntity.attributes[attribute_key];

                    if(showBaseEntity) {

                        if(attribute.value) {

                            data.push({
                                code: attribute.attributeCode,
                                value: attribute.value,
                                weight: attribute.weight,
                                inferred: attribute.inferred,
                                type: (attribute.attribute && attribute.attribute.dataType) ? attribute.attribute.dataType.className : null,
                            });
                        }
                    }
                    else {

                        newData[attribute.attribute.name] = {
                            value: attribute.value,
                            type: (attribute.attribute && attribute.attribute.dataType) ? attribute.attribute.dataType.className : null,
                        };
                        newData['baseEntityCode'] = attribute.baseEntityCode;
                        newData['validationList'] = {
                            ...newData['validationList'],
                            [attribute.attributeCode]: (attribute.attribute && attribute.attribute.dataType) ? attribute.attribute.dataType.validationList : null
                        };
                    }
                });

                if(!showBaseEntity) {
                    data.push(newData);
                }
            }
        });

        this.state.data = data;
        return data;
    }

    formatColumns = (data) => {

        let cols = [];

        Object.keys(data).forEach(data_key => {

            // data_key: value
            let value = data[data_key];

            console.log(data_key, value);

            cols.push({
                'Header': <span className="header">{value}</span>,
                'accessor': data_key
            });

            // if (value.constructor == Object) {
            //     this.formatColumns(value);
            // }
            // else {
            //     cols.push({
            //         'Header': <span className="header">{value}</span>,
            //         'accessor': data[data_key]
            //     });
            // }
        });
        return cols;
    }

    render() {

        const { root, showBaseEntity, linkCode, style } = this.props;

        let columns = [];
        let data = [];

        let children = BaseEntityQuery.getEntityChildren(root);

        if(showBaseEntity) {

            let be = BaseEntityQuery.getBaseEntity(root);
            if(be) {
                children = [be];
            }
        }
        else if(linkCode) {
            children = BaseEntityQuery.getLinkedBaseEntities(root, linkCode);
        }

        columns = this.generateHeadersFor(children);

        //   PROP column DATA FORMAT

        //   CONVERT TO THIS FORMAT

        // {
        //     {
        //         Header: 'First Name',
        //         accessor: 'PRI_FIRSTNAME'
        //     },
        //     {
        //         Header: 'Last Name',
        //         accessor: 'PRI_LASTNAME'
        //     }
        // }

        // let newColumns = this.formatColumns(columns);
        data = this.generateDataFor(children);

        return (
            <div className={`genny-table ${data.length ? null : 'empty'}`} style={style}>
                <Table {...this.props} data={data} columns={columns}/>
            </div>
        );
    }
}

export default GennyTable;
