import React, { Component } from 'react';
import { array, object, string } from 'prop-types';
import { GennyBridge, BaseEntityQuery } from 'utils/genny';
import { ImageView, ContactButton, InputAddress, InputUpload, IconSmall } from 'views/components';

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
        targetCode: string,
        value: string,
        dataType: string,
        mandatoryDataTypes: array,
    }

    state = {
        canEdit: false,
        lastSentAnswer: null,
        shouldSendAnswerEvent: false,
    }

    componentDidMount() {

        const { value, dataType } = this.props;

        if (dataType != 'Image' && dataType != 'link') {
            this.setState({
                canEdit: true
            });
        }

        this.setState({
            shouldSendAnswerEvent: true,
            lastSentAnswer: value,
            valueState: value
        });
    }

    shouldComponentUpdate() {
        return true;
    }

    componentWillReceiveProps(newProps) {

        if (newProps.value != this.props.value) {
            this.setState({
                shouldSendAnswerEvent: false,
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

        const { shouldSendAnswerEvent } = this.state;
        if(shouldSendAnswerEvent == false) return;

        const { targetCode, code, value, dataType, mandatoryDataTypes } = this.props;

        let newValue = null;

        if(event && event.full_address) {
            newValue = event.full_address;
        }
        else if( dataType == 'Upload' ) {
            newValue = event;
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
                            value: newValue,
                            weight: 1.0,
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

                        if (this.input && this.input.value) {
                            this.input.value = this.state.lastSentAnswer;
                        }
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

        if(dataType != 'java.lang.Boolean') {
            newValue = event.target.value;
        }
        else {
            newValue = event.target.checked;
        }

        this.setState({
            valueState: newValue
        });
    }

    handleFileUpload = (value) => {
        this.handleBlur(value);
    }

    handleViewFileClick = (value) => () => {
        let valueArray = null;

        if(value != null && value.startsWith('[')) {
            valueArray = JSON.parse(value);
        }

        valueArray.forEach(file => {
            if (file.uploadURL != null && typeof file.uploadURL == 'string' ) window.open(file.uploadURL);
        });
    }

    handleDeleteFileClick = () => {
        this.handleBlur('[]');
    }

    renderDiv() {

        const { value, dataType, name, subCode } = this.props;
        const { valueState } = this.state;
        switch (dataType) {

            case 'Image': {
                return <div className='table-image' >
                    <ImageView src={valueState || value} style={{ width: '30px', height: '30px' }} />
                </div>;
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
                const hasValue = valueState != null ? valueState : value;
                return (
                    <div className='table-upload-main' >
                        {
                            hasValue &&
                            <div
                                className='table-upload view-file clickable'
                                onClick={this.handleViewFileClick(hasValue)}
                            >
                                {`View ${name || 'File'}`}
                            </div> 
                        }
                        
                        {/* { TODO: UNCOMMENT when backend accepts empty array as value for answer
                            hasValue &&
                            <div
                                className='table-upload delete-file clickable'
                                onClick={this.handleDeleteFileClick}
                            >
                                <IconSmall style={{color: 'white', fontSize: '20px' }} name='cancel'/>
                            </div>
                        } */}
                        {
                            !hasValue &&
                            <InputUpload
                                className="upload-file"
                                onChange={this.handleFileUpload}
                                ref={r => this.input = r}
                                value={valueState != null ? valueState : value}
                                hideUpload={true}
                                inputComponent={
                                    <div
                                        className='table-upload view-file clickable'
                                    >
                                        {`Upload ${name || 'File' }`}
                                    </div> 
                                }
                            />
                        }
                    </div>
                );
            }

            case 'dropdown': {
                const cellValue = valueState != null ? valueState : value;
                const be = BaseEntityQuery.getBaseEntity(cellValue);
                let beAttributeValue = null;
                if(subCode) {
                    const attribute = BaseEntityQuery.getBaseEntityAttribute(cellValue, subCode);
                    beAttributeValue = attribute ? attribute.value : null;
                }
                else {
                    beAttributeValue = be && be.name && typeof be.name == 'string' ? be.name : '';
                }

                return (
                    <div className='table-dropdown'>
                        <span>
                            {beAttributeValue || ''}
                        </span>
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
                className={`editable-table-cell ${
                    this.state.canEdit &&
                    this.props.dataType != 'dropdown'
                        ? 'active'
                        : 'disabled'
                } ${ 
                    this.props.dataType == 'Upload' ||
                    this.props.dataType == 'Address'
                        ? 'expandable'
                        : '' }`
                }
                
            >
                {this.renderDiv()}
            </div>
        );
    }

}

export default GennyTableEditableCell;
