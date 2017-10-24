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

        console.log(baseEntities);
        baseEntities.forEach(baseEntity => {

            let attributes = baseEntity.attributes;
            if(attributes) {

                Object.keys(attributes).forEach(attribute_key => {

                    let attribute = attributes[attribute_key];

                    // we loop through the headers. If the header already exists we skip, otherwise we add it
                    let headers = columns.map(column => {
                        return column.Header;
                    });

                    if(!headers.includes(attribute.attribute.name)) {
                        columns.push({
                            "Header": attribute.attribute.name,
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
                                // this.sendData('Answer', answer);

                            } else {

                                console.error("to implement: regex was not validated, should show error.");
                            }
                        }
                    }
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
