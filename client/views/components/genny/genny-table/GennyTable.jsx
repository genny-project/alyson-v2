import './gennyTable.scss';
import React, { Component } from 'react';
import { Table } from '../../';
import { object, array, bool } from 'prop-types';
import { BaseEntityQuery } from 'utils/genny';
import { IconSmall } from '../../';
import { GennyBridge } from 'utils/genny';

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
        isOpen: {}
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    generateHeadersFor(baseEntities) {

        let columns = [];
        baseEntities.forEach(baseEntity => {

            let attributes = baseEntity.attributes;
            if(attributes) {

                Object.keys(attributes).forEach(attribute_key => {

                    let attribute = attributes[attribute_key];

                    // we loop through the headers. If the header already exists we skip, otherwise we add it
                    let headers = columns.map(column => {
                        return column.attributeCode;
                    });

                    if(!headers.includes(attribute.attributeCode)) {
                        columns.push({
                            "Header": this.renderHeader(attribute.attribute.name),
                            "accessor": attribute.attribute.name,
                            "Cell": this.renderEditable,
                            "attributeCode": attribute.attributeCode
                        });
                    }
                });
            }
        });

        this.state.columns = columns;
        return columns;
    }

    generateHeadersForMobile(baseEntities) {

        let columns = [];
        let accessors = [];

        baseEntities.forEach(baseEntity => {

            let attributes = baseEntity.attributes;

            if(attributes) {

                Object.keys(attributes).forEach(attribute_key => {

                    let attribute = attributes[attribute_key];

                    // we loop through the headers. If the header already exists we skip, otherwise we add it
                    let headers = accessors.map(column => {
                        return column.attributeCode;
                    });

                    if(!headers.includes(attribute.attributeCode)) {
                        accessors.push({
                            "attributeCode": attribute.attributeCode,
                            "name": attribute.attribute.name,
                        });
                    }
                });
            }
        });

        if(accessors.length > 0) {

            columns.push({
                "Header": () => {

                    //console.log(accessors);
                    return <div><span>{accessors[0].attributeCode}</span></div>
                },
                "accessor": accessors[0].attributeCode,
                "Cell": ({row, original}) => {

                    Object.prototype.getKey = function(value) {
                        let object = this;
                        return Object.keys(object).find(key => object[key] === value);
                    };

                    return (
                        <div className='table-mobile-cell'>
                                <IconSmall
                                    className='table-mobile-icon clickable'
                                    onClick={() => this.onClick(original.baseEntityCode)}
                                    name={this.state.isOpen[original.baseEntityCode] ? 'expand_more' : 'chevron_right'}
                                />
                            {
                                accessors.map((attribute, i ) => {
                                    if ( i ===  0 || i > 0 && this.state.isOpen[original.baseEntityCode] === true )
                                        return (
                                            <div key={i} className={`${ i === 0 ? 'table-mobile-cell-header' : 'table-mobile-cell-row'} ${ this.state.isOpen[original.baseEntityCode] ? 'header-divider' : null }`}>
                                                <span className='table-mobile-cell-cell'>{original.getKey(original[attribute.name])}:</span>
                                                <span className='table-mobile-cell-cell'>{original[attribute.name]}</span>
                                            </div>
                                        );
                                })
                            }
                        </div>
                    )
                }
            });
        }

        this.state.columns = columns;
        return columns;
    }

    generateHeadersForOne(baseEntities) {

        let columns = [];
        baseEntities.forEach(baseEntity => {

            let attributes = baseEntity.attributes;
            if(attributes) {

                columns.push(
                    {
                        "Header": <span style={{fontSize: '24px' }}>{baseEntity.name}</span>,
                        "columns": [
                            {
                                "Header": <span style={{fontSize: '18px' }}>ATTRIBUTE CODE</span>,
                                "accessor": 'code',
                                "maxWidth": 200,
                                "Cell": row => (
                                    <span style={{
                                        fontSize: '14px',
                                        color: row.value.startsWith("PRI_") ? 'black'
                                            : row.value.startsWith("FBK_") ? '#3B5998'
                                            : null }}>
                                        {row.value}
                                    </span>
                                )
                            },
                            {
                                "Header": <span style={{fontSize: '18px' }}>VALUE</span>,
                                "accessor": 'value',
                                "Cell": ({row, original}) => {
                                    return (
                                        <span style={{
                                            fontSize: '14px',
                                            color: original.code.startsWith("PRI_") ? 'black'
                                                : original.code.startsWith("FBK_") ? '#3B5998'
                                                : null }}>
                                            {row.value}
                                        </span>
                                    )
                                }
                            },
                            {
                                "Header": <span style={{fontSize: '18px' }}>WEIGHT</span>,
                                "accessor": 'weight',
                                "maxWidth": 100,
                                "Cell": ({row, original}) => {
                                    return (
                                        <span style={{
                                            fontSize: '14px',
                                            color: original.code.startsWith("PRI_") ? 'black'
                                                : original.code.startsWith("FBK_") ? '#3B5998'
                                                : null }}>
                                            {row.weight}
                                        </span>
                                    )
                                }
                            }
                        ]
                    }
                );
            }
        });

        this.state.columns = columns;
        return columns;
    }

    onClick = (code) => {
        this.setState(prevState => ({
            isOpen: {
                ...this.state.isOpen,
                [code]: !prevState.isOpen[code],
            }
        }));

    }

    generateDataFor(baseEntities) {

        let data = [];
        baseEntities.forEach(baseEntity => {

            if(baseEntity.attributes) {

                let newData = {}
                Object.keys(baseEntity.attributes).forEach(attribute_key => {

                    let attribute = baseEntity.attributes[attribute_key];
                    newData[attribute.attribute.name] = attribute.value;
                    newData["baseEntityCode"] = attribute.baseEntityCode;
                    newData["validationList"] = {
                        ...newData["validationList"],
                        [attribute.attributeCode]: attribute.attribute.dataType.validationList
                    };
                });

                data.push(newData);
            }
        });

        this.state.data = data;
        return data;
    }

    generateDataForOne(baseEntities) {

        let data = [];
        baseEntities.forEach(baseEntity => {

            if(baseEntity.attributes) {

                Object.keys(baseEntity.attributes).forEach(attribute_key => {

                    let newData = {}

                    let attribute = baseEntity.attributes[attribute_key];

                    newData["code"] = attribute.attributeCode;
                    newData["value"] = attribute.value;
                    newData["weight"] = attribute.weight;
                    //data.push(newData);
                    attribute.value && attribute.value != 'null' ? data.push(newData) : null;
                });
            }
        });

        this.state.data = data;
        return data;
    }

    renderHeader = name => () => {
        return <div>
            <span className='table-header'>{name}</span>
            <span><IconSmall name="sort" /></span>
        </div>
    }

    renderEditable = (cellInfo) => {

        return (
            <div
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {

                    let newValue = e.target.innerHTML;
                    if(newValue) {

                        let attributeCode = cellInfo.column.attributeCode;
                        if(attributeCode) {

                            let baseEntity = this.state.data[cellInfo.index];
                            let validationList = baseEntity.validationList[attributeCode];
                            let targetCode = baseEntity.baseEntityCode;
                            let answer = [
                                {
                                    targetCode: targetCode,
                                    attributeCode: attributeCode,
                                    value: newValue
                                }
                            ];

                            // we validate and then send the answer if OK

                            let valResult = null;
                            if (validationList.length > 0 ) {
                                valResult = validationList.every( validation => {
                                    console.log(validation);
                                    return new RegExp(validation.regex).test( newValue )
                                });
                            } else {
                                valResult = new RegExp(/.*/).test( newValue );
                            }

                            if (valResult) {
                                GennyBridge.sendAnswer(answer);

                            } else {

                                console.error("to implement: regex was not validated, should show error.");
                            }
                        }
                    }
                    console.log('cell', this.state.data[cellInfo.index][cellInfo.column.id]);
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.data[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    }

    render() {

        const { root, showBaseEntity } = this.props;

        let columns = [];
        let data = [];

        let children = BaseEntityQuery.getEntityChildren(root);

        console.log(showBaseEntity);
        if(showBaseEntity) {

            let be = BaseEntityQuery.getBaseEntity(root);
            if(be) {
                children = [be];
            }
            columns = this.generateHeadersForOne(children);
            data = this.generateDataForOne(children);

        } else {

            if(children) {
                columns = this.state.width > 900 ? this.generateHeadersFor(children) : this.generateHeadersForMobile(children);
                data = this.generateDataFor(children);
            }
        }
        return (
            <div className={`genny-table ${data.length ? null : 'empty'}`}>
                <Table {...this.props} data={data} columns={columns} />
            </div>
        );
    }
}

export default GennyTable;
