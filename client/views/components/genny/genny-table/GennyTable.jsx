import './gennyTable.scss';
import React, { Component } from 'react';
import { Table } from '../../';
import { object, array } from 'prop-types';
import BaseEntityQuery from './../../../../utils/genny/BaseEntityQuery';
import { IconSmall } from '../../';
import { GennyBridge } from 'utils/genny';

class GennyTable extends Component {

    static propTypes = {
    };

    state = {
        columns: [],
        data: [],
        columns2: [],
        data2: [],
        accessor: 'firstname',
        
        width: '0',
        height: '0',
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
        let attributes = [];

        {/*
        console.log(baseEntities);
        //loop through each base entity
        baseEntities.forEach(baseEntity => {

            let be = baseEntity;
            let beCode = be.code

            if(be.attributes) {
                
                console.log('be.attributes', be.attributes);
                Object.keys(be.attributes).forEach(attribute_key => {

                    let attribute = be.attributes[attribute_key];

                    console.log('attribute', attribute);

                    if(!attributes.includes(attribute.attributeCode)) {
                        attributes.push(
                            <div>
                                <span>{attribute.code}</span><span>{attribute.name}</span>
                            </div>
                        );
                    }
                })
            }
        });

        console.log('===============', 'attributes', attributes);

        columns.push({
            "Header": () => { return <div><span>Mobile List</span></div>},
            "accessor": baseEntities,
            "Cell": () => {
                return
                    <div>
                        baseEntityCode
                    </div>
            },
            "attributeCode": ''
        });
        */}


        columns.push({
            "Header": () => { return (
                <div>
                    <span style={ this.state.accessor === 'firstname' ? {color: 'red'} : null} onClick={() => this.changeHeader('firstname') }>firstname</span>
                    <span style={ this.state.accessor === 'middlename' ? {color: 'red'} : null} onClick={() => this.changeHeader('middlename') }>middlename</span>
                    <span style={ this.state.accessor === 'lastname' ? {color: 'red'} : null} onClick={() => this.changeHeader('lastname') }>lastname</span>
                </div>
            )},
            "accessor": () => { return ( this.state.accessor )},
            "Cell": row => {

                console.log(this.state.accessor);

                Object.prototype.getKey = function(value) {
                    let object = this;
                    return Object.keys(object).find(key => object[key] === value);
                };

                let fnKey = row.original.getKey(row.original.firstname);
                let mnKey = row.original.getKey(row.original.middlename);
                let lnKey = row.original.getKey(row.original.lastname);
                return (
                    <div>
                        <div><span>{fnKey}:</span><span>{row.original.firstname}</span></div>
                        <div><span>{mnKey}:</span><span>{row.original.middlename}</span></div>
                        <div><span>{lnKey}:</span><span>{row.original.lastname}</span></div>
                    </div>
                )
            }
        });

        this.state.columns2 = columns;
        return columns;
    }

    changeHeader = (event) => {

        this.setState({
            accessor: event 
        })
    }

    generateDataForMobile(baseEntities) {
        
        let data = [
            {
                "firstname": "aaaa",
                "middlename": "nnnn",
                "lastname": "zzzz"
            },
            {
                "firstname": "bbbb",
                "middlename": "mmmm",
                "lastname": "yyyy"
            },
            {
                "firstname": "cccc",
                "middlename": "llll",
                "lastname": "xxxx"
            }

        ];

        this.state.data2 = data;
        return data;
    }


    generateDataFor(baseEntities) {

        let data = [];
        let columns = this.state.columns;
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
                            let sourceCode = "";
                            let answer = [
                                {
                                    sourceCode: sourceCode,
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

                                console.log("Uncomment to send answer...");
                                GennyBridge.sendAnswer('Answer', answer);

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

        let query = new BaseEntityQuery(this.props);
        let columns = [];
        let data = [];
        let columns2 = [];
        let data2= [];

        let children = query.getEntityChildren(root);
        if(children) {

            if(children.length == 0 && showBaseEntity) {

                let be = query.getBaseEntity(root);
                if(be) {
                    children = [be];
                }
            }

            columns = this.generateHeadersFor(children);
            data = this.generateDataFor(children);
            columns2 = this.generateHeadersForMobile(children);
            data2 = this.generateDataForMobile(children);
            console.log('=================================');
            console.log(columns);
            console.log(data);
            console.log('=================================');
            console.log(columns2);
            console.log(data2);
            console.log('=================================');
        }

        return (
            <div className="genny-table">
                <Table {...this.props} data={data} columns={columns} />
                <div style={{ paddingTop: '50px' }} />
                <Table {...this.props} data={data2} columns={columns2} />
            </div>
        );
    }
}

export default GennyTable;
