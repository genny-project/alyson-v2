import './gennyTable.scss';
import React, { Component } from 'react';
import { object, array, bool, string } from 'prop-types';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';
import { IconSmall, Table } from 'views/components';
import { GennyTableHeader, GennyTableEditableCell, GennyTableCell, GennyTableCellMobile, GennyActionTableCell } from './genny-table-components';

var test = 0;
class GennyTable extends Component {

    static defaultProps = {
        showBaseEntity: false,
        columns: null,
        root: null,
        buttonActions: [],
      }

      static propTypes = {
        showBaseEntity: bool,
        columns: array,
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

    shouldComponentUpdate() {
      return true;
    }

    generateHeadersFor(baseEntities) {

        const { showBaseEntity } = this.props;
        const isMobile = this.state.isMobile;

        let tableColumns = [];
        let headers = [];

        baseEntities.map(baseEntity => {

            let cols = this.generateColumns(baseEntity);
            cols.map(col => {
                if( !headers.includes(col.attributeCode) ) {
                    headers.push(col.attributeCode);
                    tableColumns.push(col);
                }
            });
        });

        let mobileColumns = [];

        if(!showBaseEntity && isMobile) {

            if(tableColumns.length > 0) {

                mobileColumns.push({
                    'Header': <GennyTableHeader title={tableColumns[0].name ||  tableColumns[0].attributeCode} />,
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

                const createColumn = (attributeCode, width) => {

                    let attribute = attributes[attributeCode];
                    const attrData = BaseEntityQuery.getAttribute(attribute.attributeCode);
                    //let attrType = null;
                    let attrName = null;
                    if(attrData) {
                        //attrType = attrData.dataType ? attrData.dataType.className : null;
                        attrName = attrData.name;
                    }

                    let headers = cols.map(column => {
                        return column.attributeCode;
                    });

                    if(!headers.includes(attribute.attributeCode)) {

                        if(!isMobile) {

                            return {
                                'Header': props => {
                                    //console.log(props);
                                    return <GennyTableHeader title={attrName || attribute.attributeCode}/>;
                                },
                                'Cell': cellInfo => {

                                    const cell = cellInfo.row[attribute.attributeCode];
                                    const value = cell && cell.value;
                                    const dataType = cell && cell.type;

                                    return (
                                        <GennyTableEditableCell
                                            cell={cell}
                                            code={attribute.attributeCode}
                                            value={value}
                                            dataType={dataType}
                                            targetCode={this.state.data[cellInfo.index].baseEntityCode}
                                        />
                                    );
                                },
                                'accessor': attribute.attributeCode,
                                //'minWidth': typeof width == 'number' ? width : 300,
                                'attributeCode': attribute.attributeCode,
                                'sortMethod': (a, b) => {
                                    let valueA = a.value && a.value;
                                    let valueB = b.value && b.value;
                                    
                                    if ( parseFloat(valueA) != null && parseFloat(valueB) != null ) {
                                        return valueA < valueB ? 1 : -1;
                                    }
                                    else {
                                        return valueA.contains(valueB) || valueB.contains(valueA);
                                    }
                                },
                                'Filter': ({filter, onChange}) => (
                                    <input
                                        className='table-filter'
                                        type='text'
                                        placeholder={`Filter ${attrName}`}
                                        value={filter ? filter.value : ''}
                                        onChange={event => onChange(event.target.value)}
                                    />
                                )
                            };
                        }
                        else {
                            return {
                                'name': attrName || attribute.attributeCode,
                                'attributeCode': attribute.attributeCode
                            };
                        }
                    }

                    return null;
                };

                const columnsProps = this.props.columns;
                if (columnsProps != null && columnsProps.length > 0) {
                    for(let i = 0; i < columnsProps.length; i++) {

                        const attributeCode = columnsProps[i];
                        const width = columnsProps[i].width;

                        if(attributes[attributeCode] != null) {

                            const newColumn = createColumn(attributeCode, width);
                            if(newColumn != null) {
                                cols.push(newColumn);
                            }
                        }
                    }
                }
                else {

                    Object.keys(attributes).forEach(attribute_key => {

                        const newColumn = createColumn(attribute_key);
                        if(newColumn != null) {
                            cols.push(newColumn);
                        }
                    });
                }

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

        return cols;
    }

    generateDataFor(baseEntities) {

        const { showBaseEntity } = this.props;

        let data = [];

        baseEntities.forEach(baseEntity => {

            if(baseEntity.attributes) {

                // HIDES row if it doesnt have all the attributes

                //if (process.env.NODE_ENV === 'production') {
                    let hasAttributes = this.props.columns.every(col => {
                        const hasAttribute = Object.keys(baseEntity.attributes).includes(col);
                        return hasAttribute;
                    });

                    if (hasAttributes != true) return null;
                //}

                let newData = {};

                Object.keys(baseEntity.attributes).forEach(attribute_key => {

                    let attribute = baseEntity.attributes[attribute_key];
                    const attrData = BaseEntityQuery.getAttribute(attribute.attributeCode);
                    let attrType = null;
                    let attrName = null;
                    if(attrData) {
                        attrType = attrData.dataType ? attrData.dataType.className : null;
                        attrName = attrData.name;
                    }

                    if(showBaseEntity) {
                        if(attribute.value) {

                            data.push({
                                code: attribute.attributeCode,
                                value: attribute.value,
                                weight: attribute.weight,
                                inferred: attribute.inferred,
                                name: attrName,
                                type: attrType,
                            });
                        }
                    }
                    else {

                        newData[attribute.attributeCode] = {
                            value: attribute.value,
                            weight: attribute.weight,
                            code: attribute.attributeCode,
                            name: attrName,
                            type: attrType,
                        };
                        newData['baseEntityCode'] = attribute.baseEntityCode;
                        newData['validationList'] = {
                            ...newData['validationList'],
                            [attribute.attributeCode]: attrType
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

    render() {

        const { root, showBaseEntity, linkCode, style, columns } = this.props;

        let tableColumns = [];
        let tableData = [];
        let children = BaseEntityQuery.getEntityChildren(root);

        if(showBaseEntity != null && showBaseEntity === true) {

            let be = BaseEntityQuery.getBaseEntity(root);
            if(be) {
                children = [be];
            }
        }
        else if(linkCode != null) {
            children = BaseEntityQuery.getLinkedBaseEntities(root, linkCode);
        }

        tableColumns = this.generateHeadersFor(children);
        tableData = this.generateDataFor(children);

        return (
            <div className={`genny-table ${tableData.length > 0 ? '' : 'empty'} ${window.getScreenSize()}`} style={style}>
                <Table {...this.props} data={tableData} columns={tableColumns} itemsPerPage={tableData != null && tableData.length < 20 ? tableData.length : 20} />
            </div>
        );
    }
}

export default GennyTable;
