import React, { Component } from 'react';
import { array, object } from 'prop-types';
import { GennyBridge } from 'utils/genny';

class GennyTableEditableCell extends Component {

    static defaultProps = {
        data: [],
        cellInfo: {},
    }

    static propTypes = {
        data: array,
        cellInfo: object,
    }

    render() {

        return (
            <div
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {

                    let newValue = e.target.innerHTML;
                    if(newValue) {

                        let attributeCode = this.props.cellInfo.column.attributeCode;
                        if(attributeCode) {

                            let baseEntity = this.props.data[this.props.cellInfo.index];
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
                    console.log('cell', this.props.data[this.props.cellInfo.index][this.props.cellInfo.column.id]);
                }}
                dangerouslySetInnerHTML={{
                    __html: this.props.data[this.props.cellInfo.index][this.props.cellInfo.column.id]
                }}
            />
        );
    }

}

export default GennyTableEditableCell;
