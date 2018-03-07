import React, { Component } from 'react';
import { array, object, bool } from 'prop-types';
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

    state = {
        canEdit: false,
        lastSentAnswer: null
    }

    componentDidMount() {
        if (this.props.data[this.props.cellInfo.index][this.props.cellInfo.column.id] != ( null || undefined ) ) {
            let dataType = this.props.data[this.props.cellInfo.index][this.props.cellInfo.column.id].type;
            if (dataType != 'Image' && dataType != 'link' && dataType != 'java.lang.Boolean') {
                this.setState({
                    canEdit: true
                });
            }
            let value = this.props.data[this.props.cellInfo.index][this.props.cellInfo.column.id].value;
            this.setState({
                lastSentAnswer: value
            });
        }
    }

    handleKeyDown = (event) => {
        if (event.keyCode == '13') {
            event.preventDefault();
            this.handleBlur(event);
        }
    }

    handleBlur = (event) => {
        let newValue = event.target.value;
        if(newValue && newValue != this.props.data[this.props.cellInfo.index][this.props.cellInfo.column.id].value) {

            let attributeCode = this.props.cellInfo.column.attributeCode;
            if(attributeCode) {

                let baseEntity = this.props.data[this.props.cellInfo.index];                
                let targetCode = baseEntity.baseEntityCode;
                
                let answer = [
                    {
                        targetCode: targetCode,
                        attributeCode: attributeCode,
                        value: newValue
                    }
                ];

                //console.log(newValue, this.state.lastSentAnswer);

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

        if (this.props.data[this.props.cellInfo.index][this.props.cellInfo.column.id] == null ) return null;

        let dataType = this.props.data[this.props.cellInfo.index][this.props.cellInfo.column.id].type;
        let value = this.props.data[this.props.cellInfo.index][this.props.cellInfo.column.id].value;

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
