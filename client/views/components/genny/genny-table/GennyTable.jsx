import './gennyTable.scss';
import React, { Component } from 'react';
import { object, array, bool, string } from 'prop-types';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';
import { IconSmall, Table } from 'views/components';
import { GennyTableHeader, GennyTableEditableCell, GennyTableCell, GennyTableCellMobile, GennyActionTableCell } from './genny-table-components';

var canShowLogs = false;
class GennyTable extends Component {

    static defaultProps = {
        showBaseEntity: false,
        columns: null,
        root: null,
        buttonActions: [],
      }

      static propTypes = {
        showBaseEntity: bool,
        columns: [],
        root: string,
        buttonActions: array,
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
                    'Header': <GennyTableHeader title={tableColumns[0].attributeName ||  tableColumns[0].attributeCode} />,
                    'accessor': tableColumns[0].attributeCode,
                    'Cell': ({row, original}) => <GennyTableCellMobile data={tableColumns} row={row} original={original} />
                });
            }
        }

        this.state.columns = isMobile ? mobileColumns : tableColumns;

        canShowLogs ? console.log(this.state.columns) : null;

        return isMobile ? mobileColumns : tableColumns;
    }

    generateColumns = (baseEntity) => {

        const { showBaseEntity, linkCode } = this.props;
        const { isMobile } = this.state;
        let cols = [];

        if(showBaseEntity) {

            let c = [];
            if(this.props.buttonActions.length > 0) {
                c.push({
                    'Header': <span className="header-single">Actions</span>,
                    'accessor': 'actions',
                    'Cell': ({row, original}) => <GennyActionTableCell original={original} value={row.code} />
                });
            }

            c.push({
                'Header': <span className="header-single">ATTRIBUTE CODE</span>,
                'accessor': 'code',
                'Cell': ({row, original}) => <GennyTableCell original={original} value={row.code} />
            });

            c.push({
                'Header': <span className="header-single">VALUE</span>,
                'accessor': 'value',
                'Cell': ({row, original}) => <GennyTableCell original={original} dataType={original.type} value={row.value} />
            });

            c.push({
                'Header': <span className="header-single">WEIGHT</span>,
                'accessor': 'weight',
                'Cell': ({row, original}) => <GennyTableCell original={original} value={row.weight} />
            });

            cols.push({
                'Header': <span className="header-single-table">{baseEntity.name}</span>,
                'columns': c
            });

        }
        else {

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
                            newCol.Header = <GennyTableHeader title={attribute.attributeName || attribute.attributeCode}/>;
                            newCol.Cell = (cellInfo) => <GennyTableEditableCell data={this.state.data} cellInfo={cellInfo} />;
                            newCol.accessor = attribute.attributeCode;
                            newCol.minWidth = 200;
                        }
                        else {
                            newCol.name = attribute.attributeCode;
                        }

                        cols.push(newCol);
                    }
                });

                if(this.props.buttonActions.length > 0) {
                    cols.splice(0, 0, {
                        'Header': <span className="header-single">Actions</span>,
                        'accessor': 'actions',
                        'Cell': ({row, original}) => <GennyActionTableCell original={original} value={row.code} />,
                        'minWidth': 140
                    });
                }
            }
        }

        canShowLogs ? console.log("cols") : null;
        canShowLogs ? console.log(cols) : null;
        return cols;
    }

    generateDataFor(baseEntities) {

        const { showBaseEntity } = this.props;

        let data = [];

        baseEntities.forEach(baseEntity => {

            console.log(baseEntity);
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

                        newData[attribute.attributeCode] = {
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

                    newData['actions'] = {
                        value: this.props.buttonActions
                    };

                    data.push(newData);
                }
                else {
                    data.push({
                        actions: this.props.buttonActions
                    });
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

            cols.push({
                'Header': <span className="header">{value}</span>,
                'accessor': data_key
            });
        });
        return cols;
    }

    render() {

        const { root, showBaseEntity, linkCode, style } = this.props;

        let columns = [];
        let data = [];

        canShowLogs = root == "PER_USER1";
        canShowLogs ? console.log( linkCode ) : null;

        let children = BaseEntityQuery.getEntityChildren(root);

        if(showBaseEntity) {

            let be = BaseEntityQuery.getBaseEntity(root);
            if(be) {
                children = [be];
            }
        }
        else if(linkCode) {
            children = BaseEntityQuery.getLinkedBaseEntities(root, linkCode);
            canShowLogs ? console.log( children ) : null;
        }

        columns = this.generateHeadersFor(children);
        data = this.generateDataFor(children);

        return (
            <div className={`genny-table ${data.length > 0 ? '' : 'empty'}`} style={style}>
                <Table {...this.props} data={data} columns={columns} itemsPerPage={data != null && data.length < 20 ? data.length : 20} />
            </div>
        );
    }
}

export default GennyTable;
