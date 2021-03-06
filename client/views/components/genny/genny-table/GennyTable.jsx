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
        actions: [],
        showTitle: true,
      }

      static propTypes = {
        showBaseEntity: bool,
        columns: array,
        root: string,
        actions: array,
        showTitle: bool,
        linkCode: string
      }

    state = {

        data: [],
        columns: [],
        width: null,
        height: null,
        isOpen: {},
        isMobile: window.getScreenSize() == 'sm',
        selectedItems: []
    }

    shouldComponentUpdate() {
      return true;
    }

    componentWillReceiveProps() {
        this.reloadData();
    }

    componentDidMount() {
        this.reloadData();
    }

    reloadData() {

        const { root, showBaseEntity, linkCode } = this.props;

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

        this.setState({
            columns: tableColumns,
            data: tableData
        });
    }

    handleClickColumn = () => {
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

                let usedSubCodes = [];

                const createColumn = (attributeCode, width, columnName, subCode) => {

                    let attribute = attributes[attributeCode];
                    const attrData = BaseEntityQuery.getAttribute( ( attribute && attribute.attributeCode ) || attributeCode);
                    //let attrType = null;
                    let attrName = null;

                    if(attrData && attrData.name) {
                        attrName = attrData.name;
                    }

                    let headers = cols.map(column => {
                        const header = column.attributeCode;
                        return header;
                    });

                    if(
                        !headers.includes( (attribute && attribute.attributeCode) || attributeCode || `${attributeCode}.${subCode}`) ||
                        (
                            headers.includes( (attribute && attribute.attributeCode) || attributeCode ) &&
                            !usedSubCodes.includes(subCode)
                        )
                    ) {

                        if(!isMobile) {

                            return {
                                'Header': props => {
                                    //console.log(props);
                                    return <GennyTableHeader title={columnName || attrName || (attribute && attribute.attributeCode) || attributeCode }/>;
                                },
                                'Cell': cellInfo => {
                                    const cell = cellInfo.row[ ( attribute && attribute.attributeCode ) || attributeCode];
                                    const value = cell && cell.value;
                                    const attributeBE = BaseEntityQuery.getAttribute( attributeCode );
                                    const dataType = ( cell && cell.type ) || attributeBE && attributeBE.dataType && attributeBE.dataType.typeName ;
                                    const rowCode = cellInfo.original.baseEntityCode;

                                    return (
                                        <GennyTableEditableCell
                                            cell={cell}
                                            rowCode={rowCode}
                                            code={( attribute && attribute.attributeCode ) || attributeCode}
                                            subCode={subCode}
                                            name={attribute && attribute.attributeName}
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
                                'attributeCode': subCode ? `${attributeCode}.${subCode}` : (attribute && attribute.attributeCode) || attributeCode,
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
                                        placeholder={`Filter ${columnName || attrName}`}
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

                const columnsProps = this.props.columns;
                let actionsColumnProps = null;

                if (columnsProps != null && columnsProps.length > 0) {

                    for(let i = 0; i < columnsProps.length; i++) {

                        let attributeCode = null;
                        let width = null;
                        let name = null;
                        let subCode = null;

                        const colProps = columnsProps[i];

                        /* if it is a string */
                        if(colProps.length) {
                            attributeCode = colProps;
                        }

                        /* if it is an object  */
                        else {
                            //attributeCode = columnsProps[i].subCode ? `${columnsProps[i].code}.${columnsProps[i].subCode}` : columnsProps[i].code;
                            attributeCode = colProps.code;
                            width = colProps.width;
                            name = colProps.title;
                            subCode = colProps.subCode;
                        }

                        if (attributeCode && attributeCode === 'TABLE_ACTIONS') {
                            actionsColumnProps = {
                                ...colProps,
                                index: i,
                            };
                        }

                        const newColumn = createColumn(attributeCode, width, name, subCode);
                        if(newColumn != null) {
                            usedSubCodes.push(subCode);
                            cols.push(newColumn);
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

                if ( this.props.actions && this.props.actions.length > 0 ) {
                    const index = actionsColumnProps ? actionsColumnProps.index : 0;
                    const title = actionsColumnProps ? actionsColumnProps.title : 'Actions';
                    const width = actionsColumnProps ? actionsColumnProps.width : 120 * this.props.actions.length;
                    const code = actionsColumnProps ? actionsColumnProps.code : 'DETAILS';
                    cols.splice(index, 0, {
                        'Header': <span className="header-single">{title}</span>,
                        'accessor': 'actions',
                        'attributeCode': code,
                        'Cell': ({original}) => {
                            return (
                                <div
                                    className='table-actions'
                                >
                                    {
                                        this.props.actions &&
                                        this.props.actions.length > 0 &&
                                        this.props.actions.map(( action, index ) => {
                                            const margin = index === this.props.actions.length - 1 ? { } : { marginRight: '5px' };
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
                                                        ...margin,
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
                        'minWidth': width
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
                                style={{display: 'none'}}
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

        const { showBaseEntity } = this.props;

        let data = [];

        baseEntities.forEach(baseEntity => {

            if(baseEntity.attributes) {

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

        return data;
    }

    render() {

        const { root, style, showTitle } = this.props;
        const { data, columns, selectedItems } = this.state;

        const rootEntity = BaseEntityQuery.getBaseEntity(root);
        const projectCode = GennyBridge.getProject();
        let projectColor = BaseEntityQuery.getBaseEntityAttribute(projectCode, 'PRI_COLOR');
        projectColor = projectColor ? projectColor.value : null;

        return (
            <div className={`genny-table ${data.length > 0 ? '' : 'empty'} ${window.getScreenSize()}`} style={style}>
                { showTitle ?
                    <div style={{ backgroundColor: projectColor}} className='genny-list-title sticky'>
                        <span>{rootEntity && rootEntity.name} ( {data && data.length} )</span>
                    </div>
                : null }
                <Table {...this.props} data={data} columns={columns} itemsPerPage={data != null && data.length < 20 ? data.length : 20} selectedRows={selectedItems}/>
            </div>
        );
    }
}

export default GennyTable;
