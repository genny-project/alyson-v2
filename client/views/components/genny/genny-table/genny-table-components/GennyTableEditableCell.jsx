import React, { Component } from 'react';
import { array, object, bool, string } from 'prop-types';
import { GennyBridge } from 'utils/genny';
import { ImageView } from 'views/components';

class GennyTableEditableCell extends Component {

    static defaultProps = {
        data: [],
        cellInfo: {},
        code: null,
    }

    static propTypes = {
        data: array,
        cellInfo: object,
        code: string,
    }

    state = {
        canEdit: false,
        lastSentAnswer: null
    }

    componentDidMount() {

        const { cellInfo, code, value, dataType } = this.props;

        if (dataType != 'Image' && dataType != 'link' && dataType != 'java.lang.Boolean') {
            this.setState({
                canEdit: true
            });
        }

        this.setState({
            lastSentAnswer: value
        });
    }

    shouldComponentUpdate() {
        return true;
    }

    handleKeyDown = (event) => {
        if (event.keyCode == '13') {
            event.preventDefault();
            this.handleBlur(event);
        }
    }

    handleBlur = (event) => {
        
        let newValue = event.target.value;

        //value
        if(newValue && newValue != this.props.data[this.props.cellInfo.index][this.props.cellInfo.column.id].value) {

            //code
            let attributeCode = this.props.cellInfo.column.attributeCode;
            if(attributeCode) {

                //be
                let baseEntity = this.props.data[this.props.cellInfo.index];
                let targetCode = baseEntity.baseEntityCode;

                let answer = [
                    {
                        targetCode: targetCode,
                        attributeCode: attributeCode,
                        value: newValue
                    }
                ];

                if ( newValue != this.state.lastSentAnswer ) {
                    if (confirm('Are you sure you want to change this information?')) {
                        GennyBridge.sendAnswer(answer);
                        this.setState({
                            lastSentAnswer: newValue
                        });
                    }
                    else {
                        this.input.value = this.state.lastSentAnswer;
                    }
                }
            }
        }
    }

    renderDiv() {

        const { cellInfo, code, value, dataType } = this.props;

        // console.log( ' ---------------' )
        // console.log( value );
        // console.log( cellInfo );

        switch (dataType) {

            case 'Image': {
                return <ImageView src={value} style={{ width: '50px', height: '50px' }} />;
            }

            case 'link': {

                return <a href={value}>Click Here</a>;
            }

            case 'java.lang.Boolean': {
                return (
                    <input
                        checked={value}
                        type="checkbox"
                    />
                );
            }

            default: {
                return (
                    <input
                        ref={r => this.input = r}
                        className="table-input"
                        defaultValue={value}
                        type="text"
                        onBlur={this.handleBlur}
                        onKeyDown={this.handleKeyDown}
                    />
                );
            }
        }
    }

    render() {

        return (
            <div
                // contentEditable={this.state.canEdit}
                // suppressContentEditableWarning
                className={`editable-table-cell ${ this.state.canEdit ? 'active' : 'disabled' }`}
            >
                {this.renderDiv()}
            </div>
        );
    }

}

export default GennyTableEditableCell;
