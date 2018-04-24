import React, { Component } from 'react';
import { array, object, bool, string } from 'prop-types';
import { GennyBridge } from 'utils/genny';
import { ImageView, ContactButton } from 'views/components';

class GennyTableEditableCell extends Component {

    static defaultProps = {
        cellInfo: {},
        code: null,
    }

    static propTypes = {
        cellInfo: object,
        code: string,
        value: string,
        dataType: string,
    }

    state = {
        canEdit: false,
        lastSentAnswer: null
    }

    componentDidMount() {

        const { value, dataType } = this.props;

        if (dataType != 'Image' && dataType != 'link' && dataType != 'java.lang.Boolean') {
            this.setState({
                canEdit: true
            });
        }

        this.setState({
            lastSentAnswer: value,
            valueState: value
        });
    }

    shouldComponentUpdate() {
        return true;
    }

    componentWillReceiveProps(newProps) {
        //console.log(this.props.value, newProps.value);
        if (newProps.value != this.props.value) {
            this.setState({
                value: newProps.value,
                valueState: newProps.value
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

        const { targetCode, code, value } = this.props;

        let newValue = event.target.value;

        if(newValue != null && newValue != value) {

            if (newValue.length == 0 ){
                alert('Field must not be empty.');
                this.setState({
                    valueState: value
                });
            }
            else {
                if(code) {

                    let answer = [
                        {
                            targetCode: targetCode,
                            attributeCode: code,
                            value: newValue
                        }
                    ];

                    //if ( newValue != this.state.lastSentAnswer ) {
                        if (confirm('Are you sure you want to change this information?')) {
                            GennyBridge.sendAnswer(answer);
                            this.setState({
                                lastSentAnswer: newValue
                            });
                        }
                        else {
                            this.setState({
                                valueState: this.state.lastSentAnswer
                            });
                        }
                        this.input.value = this.state.lastSentAnswer;
                    //}
                }
            }
        }
    }

    handleChange = (event) => {
        let newValue = event.target.value;

        this.setState({
            valueState: newValue
        });
    }

    renderDiv() {

        const { value, dataType } = this.props;
        const { valueState } = this.state;

        switch (dataType) {

            case 'Image': {
                return <ImageView src={valueState || value} style={{ width: '30px', height: '30px' }} />;
            }

            case 'link': {
                return <a href={valueState || value}>Click Here</a>;
            }

            case 'java.lang.Boolean': {
                return (
                    <input
                        checked={valueState || value}
                        type="checkbox"
                    />
                );
            }

            case 'Mobile': 
            case 'Email' : {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                        <ContactButton
                            link={value}
                            icon={dataType == 'Email' ? 'email' : 'phone'}
                            type={dataType == 'Email' ? 'mailto' : 'tel'}
                            style={{marginRight: '5px'}}
                        />
                        <input
                            ref={r => this.input = r}
                            className="table-input"
                            value={valueState != null ? valueState : value}
                            type="text"
                            onBlur={this.handleBlur}
                            onKeyDown={this.handleKeyDown}
                            onChange={this.handleChange}
                        />
                    </div>
                );
            }

            default: {
                return (
                    <input
                        ref={r => this.input = r}
                        className="table-input"
                        value={valueState != null ? valueState : value}
                        type="text"
                        onBlur={this.handleBlur}
                        onKeyDown={this.handleKeyDown}
                        onChange={this.handleChange}
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
