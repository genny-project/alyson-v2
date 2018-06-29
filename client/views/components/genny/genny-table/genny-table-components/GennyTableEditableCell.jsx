import React, { Component } from 'react';
import { array, object, string } from 'prop-types';
import { GennyBridge } from 'utils/genny';
import { ImageView, ContactButton, InputAddress, Dropdown } from 'views/components';
import ReactDropdown from 'react-dropdown';
import FileViewer from '../../../generic/file-viewer/FileViewer';

class GennyTableEditableCell extends Component {

    static defaultProps = {
        cellInfo: {},
        code: null,
        mandatoryDataTypes: [
            'Landline',
            'Mobile',
            'Email',
        ]
    }

    static propTypes = {
        cellInfo: object,
        code: string,
        value: string,
        dataType: string,
        mandatoryDataTypes: array,
    }

    state = {
        canEdit: false,
        lastSentAnswer: null
    }

    componentDidMount() {

        const { value, dataType } = this.props;

        if (dataType != 'Image' && dataType != 'link') {
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
        console.log('key', event.keyCode);
        if (event.keyCode == '13') {
            event.preventDefault();
            this.handleBlur(event);
        }
    }

    handleBlur = (event) => {

        const { targetCode, code, value, dataType, mandatoryDataTypes } = this.props;

        let newValue = null;

        if(event.full_address) {
            newValue = event.full_address;
        }
        else if( dataType != 'java.lang.Boolean' ) {
            newValue = event.target.value;
        }
        else {
            newValue = event.target.checked;
        }

        if(value == null && newValue == '') return;
        if(newValue != null && newValue != value ) {

            if (
                newValue.length == 0 &&
                mandatoryDataTypes.includes(dataType)
            ){
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
        if (this.props.onBlur) this.props.onBlur(this.props.rowCode);
    }

    handleFocus = () => {
        if (this.props.onFocus) this.props.onFocus(this.props.rowCode);
    }

    handleChange = (event) => {

        const { dataType } = this.props;

        let newValue = null;

        if(dataType != "java.lang.Boolean") {
            newValue = event.target.value;
        }
        else {
            newValue = event.target.checked
        }

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
                    <div
                        style={{
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <input
                            checked={valueState === false ? false : true}
                            onChange={(event) => { this.handleChange(event); this.handleBlur(event); }}
                            type="checkbox"
                        />
                    </div>
                );
            }

            case 'Address': {
                return (
                    <InputAddress
                        ref={r => this.input = r}
                        value={valueState != null ? valueState : value}
                        hideMap={true}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        onKeyDown={this.handleKeyDown}
                        onChange={this.handleChange}
                    />
                );
            }

            case 'Mobile':
            case 'Landline':
            case 'Email' : {
                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', height: '100%'}}>
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
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            onKeyDown={this.handleKeyDown}
                            onChange={this.handleChange}
                        />
                    </div>
                );
            }

            case 'Upload': {
                return (
                    <Dropdown
                        animateHeader={false}
                        inline={true}
                        isSlide={false}
                        header={
                            <div
                                className='table-upload-view'
                            >
                                VIEW FILES
                            </div>
                        }
                        contentStyle={{
                            padding: 0,
                            paddingTop: '5px',
                            background: 'none'
                        }}
                    >
                        <div
                            className="file-viewer-dropdown"
                        >
                            <FileViewer
                                items={valueState != null ? valueState : value}
                            />
                        </div>
                    </Dropdown>
                );
            }

            default: {
                return (
                    <input
                        ref={r => this.input = r}
                        className="table-input"
                        value={valueState != null ? valueState : value}
                        type="text"
                        onFocus={this.handleFocus}
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
                className={`editable-table-cell ${ this.state.canEdit ? 'active' : 'disabled' } ${ this.props.dataType == 'Upload' || this.props.dataType == 'Address' ? 'expandable' : '' }`}
                
            >
                {this.renderDiv()}
            </div>
        );
    }

}

export default GennyTableEditableCell;
