import './gennyTable.scss';
import React, { Component } from 'react';
import { object, array, bool, string } from 'prop-types';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';
import { IconSmall, Table, GennyButton } from 'views/components';
import { GennyTableHeader, GennyTableEditableCell, GennyTableCell, GennyTableCellMobile, GennyActionTableCell, GennyTableSelectCell } from './genny-table-components';

class GennyTable extends Component {

    static defaultProps = {
        showBaseEntity: false,
        columns: null,
        root: null,
        actions: [
            // {
            //     name: 'View Details',
            //     code: 'BTN_VIEW_DETAILS',
            // }
        ],
      }

      static propTypes = {
        showBaseEntity: bool,
        columns: array,
        root: string,
        actions: array,
      }

    state = {

        data: [],
        width: null,
        height: null,
        isOpen: {},
        isMobile: window.getScreenSize() == 'sm',
        selectedItems: []
    }

    shouldComponentUpdate() {
      return true;
    }

    handleClickColumn = (rowCodes) => {
         //TODO - ALLOW MULTISELECT
        // if (rowCodes.every(code => this.state.selectedItems.includes(code) )) {
        //     this.setState({
        //         selectedItems: []
        //     });
        // } else {
        //     this.setState({
        //         selectedItems: [...rowCodes]
        //     });
        // }
        this.setState({
            selectedItems: []
        });
    }

    handleClickRow = (itemCode) => {
        if (this.state.selectedItems.includes(itemCode)) {
            this.removeItem(itemCode);
        } else {
            this.addSelectedItem(itemCode);
        }
    }

    handleFocusCell = (itemCode) => {
        if (!this.state.selectedItems.includes(itemCode)) {
            this.addSelectedItem(itemCode);
        }
    }

    handleBlurCell = (itemCode) => {
        if (this.state.selectedItems.includes(itemCode)) {
            this.removeItem(itemCode);
        }
    }

    addSelectedItem = (itemCode) => {
        this.setState({
            //TODO - ALLOW MULTISELECT
            // selectedItems: [...this.state.selectedItems, itemCode]
            selectedItems: [itemCode]
        }, () => {
            this.sendSelectMessage(itemCode);
        });
    }

    removeItem = (itemCode) => {
        this.setState(({ selectedItems }) => {
            return {
                selectedItems: selectedItems.filter(i => i !== itemCode),
            };
        }, () => {
            this.sendSelectMessage('');
        });
    }

    sendSelectMessage = (itemCode) => {
        let btnValue = JSON.stringify({
            itemCode: itemCode,
            hint: this.props.root,
            userCode: GennyBridge.getUser()
        });

        GennyBridge.sendBtnClick('BTN_CLICK', {
            code: 'BTN_TABLE_SELECT',
            value: btnValue || null,
        });
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

                const createColumn = (attributeCode, width, columnName) => {

                    let attribute = attributes[attributeCode];
                    const attrData = BaseEntityQuery.getAttribute( ( attribute && attribute.attributeCode ) || attributeCode);
                    //let attrType = null;
                    let attrName = null;

                    if(attrData) {

                        /* TODO: to remove. channel40 only. hardwired here because backend is not sending column names */
                        let name = "";
                        if(attrData.name == "Buyer Role") {
                            name = "Is Freight Owner";
                        }
                        else if(attrData.name == "Seller Role") {
                            name = "Is Transport Operator";
                        }
                        else {
                            name = attrData.name;
                        }

                        attrName = name;
                    }

                    let headers = cols.map(column => {
                        return column.attributeCode;
                    });

                    if(!headers.includes( (attribute && attribute.attributeCode) || attributeCode ) ) {

                        if(!isMobile) {

                            return {
                                'Header': props => {
                                    //console.log(props);
                                    return <GennyTableHeader title={columnName || attrName || (attribute && attribute.attributeCode) || attributeCode }/>;
                                },
                                'Cell': cellInfo => {
                                    const cell = cellInfo.row[ ( attribute && attribute.attributeCode ) || attributeCode];
                                    const value = cell && cell.value;
                                    const dataType = cell && cell.type;
                                    const rowCode = cellInfo.original.baseEntityCode;

                                    return (
                                        <GennyTableEditableCell
                                            cell={cell}
                                            rowCode={rowCode}
                                            code={( attribute && attribute.attributeCode ) || attributeCode}
                                            value={value}
                                            dataType={dataType}
                                            targetCode={this.state.data[cellInfo.index].baseEntityCode}
                                            onFocus={this.handleFocusCell}
                                            onBlur={this.handleBlurCell}
                                        />
                                    );
                                },
                                'accessor': (attribute && attribute.attributeCode) || attributeCode,
                                //'minWidth': typeof width == 'number' ? width : null,
                                'attributeCode': (attribute && attribute.attributeCode) || attributeCode,
                                'sortMethod': (a, b) => {
                                    let valueA = a.value && a.value;
                                    let valueB = b.value && b.value;

                                    if ( parseFloat(valueA) != null && parseFloat(valueB) != null ) {
                                        return valueA < valueB ? 1 : -1;
                                    }
                                    else {
                                        return valueA.toLowerCase().compareLocale(valueB.toLowerCase()) ? 1 : -1;
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
                                ),
                                'filterMethod': (filter, row, column) => {
                                    const cell = row[( attribute && attribute.attributeCode ) || attributeCode];
                                    const cellValue = cell && cell.value;
                                    const filterValue = filter && filter.value;

                                    if (cellValue && filterValue) {
                                        return cellValue.toLowerCase().includes(filterValue.toLowerCase());
                                    }
                                    return false;
                                },
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

                const createActionColumn = () => {

                };

                const columnsProps = this.props.columns;
                //const columnsProps = null;
                
                if (columnsProps != null && columnsProps.length > 0) {

                    for(let i = 0; i < columnsProps.length; i++) {

                        const attributeCode = columnsProps[i].code;
                        const width = columnsProps[i].width;
                        const name = columnsProps[i].title;

                        //if(attributes[attributeCode] != null) {

                            const newColumn = createColumn(attributeCode, width, name);
                            if(newColumn != null) {
                                cols.push(newColumn);
                            }
                        //}
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

                // if(this.props.actions.length > 0) {
                //     cols.splice(0, 0, {
                //         'Header': <span className="header-single">Actions</span>,
                //         'accessor': 'actions',
                //         'Cell': ({row, original}) => <GennyActionTableCell original={original} value={row.code} />,
                //         'minWidth': 140
                //     });
                // }

                if ( this.props.actions && this.props.actions.length > 0 ) {
                    cols.splice(0, 0, {
                        'Header': <span className="header-single">Actions</span>,
                        'accessor': 'actions',
                        'attributeCode': 'DETAILS',
                        'Cell': ({original}) => {
                            return (
                                <div
                                    className='table-actions'
                                >
                                    {
                                        this.props.actions &&
                                        this.props.actions.length > 0 &&
                                        this.props.actions.map(action => {
                                            return (
                                                <GennyButton
                                                    buttonCode={action.code}
                                                    value={{
                                                        itemCode: original.baseEntityCode,
                                                        hint: this.props.root
                                                    }}
                                                    buttonStyle={{
                                                        backgroundColor: action.color || '#5fa5ec',
                                                    }}
                                                    style={{
                                                        height: '100%',
                                                    }}
                                                >
                                                    { action.icon && <IconSmall style={{color: 'white', marginRight: '5px'}} name={action.icon}/> }
                                                    <span style={{color: 'white', fontSize:'0.7em'}}>{action.title}</span>
                                                </GennyButton>
                                            );
                                        })
                                    }
                                </div>
                            );
                        },
                        'minWidth': 120 * this.props.actions.length
                    });
                }

                cols.splice(0, 0, {
                    'Header': ({data}) => {
                        const rowCodes = data.map(row => { return row._original.baseEntityCode;});
                        const isChecked = rowCodes.every(code => this.state.selectedItems.includes(code) );
                        return (
                            <input
                                checked={isChecked}
                                type="checkbox"
                                onClick={() => this.handleClickColumn(rowCodes)}
                            />
                        );
                    },
                    'accessor': 'select',
                    'attributeCode': 'SELECT',
                    'Cell': ({original}) => {
                        const code = original.baseEntityCode;
                        return (
                            <GennyTableSelectCell
                                isSelected={this.state.selectedItems.includes(code)}
                                beCode={code}
                                onClick={this.handleClickRow}
                            />
                        );
                    },
                    'resizable': false,
                    'sortable': false,
                    'minWidth': 20,
                });
            }
        }

        return cols;
    }

    generateDataFor(baseEntities) {

        const { showBaseEntity, columns } = this.props;

        let data = [];

        baseEntities.forEach(baseEntity => {

            if(baseEntity.attributes) {


                // hides ROW if row is missing an attribute from the columns

                // let hasAttributes = true;
                // if (columns) {
                //     hasAttributes = columns.every(col => {
                //         const hasAttribute = Object.keys(baseEntity.attributes).includes(col);
                //         return hasAttribute;
                //     });
                // }

                // if (hasAttributes != true) return null;

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
                <Table {...this.props} data={tableData} columns={tableColumns} itemsPerPage={tableData != null && tableData.length < 20 ? tableData.length : 20} selectedRows={this.state.selectedItems}/>
            </div>
        );
    }
}

export default GennyTable;
