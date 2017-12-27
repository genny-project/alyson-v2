import React, { Component } from 'react';
import { array, object } from 'prop-types';
import { GennyBridge } from 'utils/genny';
import { ImageView } from 'views/components';

class GennyTableEditableCell extends Component {

    static defaultProps = {
        data: [],
        cellInfo: {},
    }

    static propTypes = {
        data: array,
        cellInfo: object,
    }

    renderDiv() {

        let dataType = this.props.data[this.props.cellInfo.index][this.props.cellInfo.column.id].type;
        let value = this.props.data[this.props.cellInfo.index][this.props.cellInfo.column.id].value;

        switch (dataType) {

            case "Image": {
                return <ImageView src={value} style={{ "width": "50px", "height": "50px", "borderRadius": "25px" }} />
            }

            default: {

                return (
                    <span>
                        {value}
                    </span>
                );
            }
        }

        return null
    }

    render() {

        return (
            <div
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {

                    let newValue = e.target.innerHTML;
                    if(newValue && newValue != this.props.data[this.props.cellInfo.index][this.props.cellInfo.column.id].value) {

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
                }}>

                {this.renderDiv()}

            </div>
        );
    }

}

export default GennyTableEditableCell;
