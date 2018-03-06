import './inputText.scss';
import React, { Component } from 'react';
import { string, bool, array, object, any, func } from 'prop-types';
import { Label, SubmitStatusIcon } from 'views/components';
import MaskedTextInput from 'react-text-mask';

class InputText extends Component {

    static defaultProps = {
        className: '',
        validationList: [],
        mask: '',
        name: '',
        placeholder: '',
        value: '',
        readOnly: false,
        mandatory: false,
        identifier: null,
        validationStatus: null,
    }

    static propTypes = {
        className: string,
        style: object,
        validationList: array,
        mask: string,
        name: string,
        placeholder: string,
        value: string,
        readOnly: bool,
        mandatory: bool,
        validation: func,
        identifier: any,
        validationStatus: string,
        isHorizontal: bool,
        handleOnChange: func,
        inputType: string,
        inputMask: any,
        hideHeader: bool,
        onBlur: func,
        onFocus: func
    }

    state = {
        date: new Date(),
        hasChanges: false,
    }

    handleChange = event => {

        const { handleOnChange } = this.props;
        const value = event.target.value;

        if(handleOnChange) handleOnChange(value);
    }

    handleFocus = () => {
        const { onFocus } = this.props;
        if(onFocus) onFocus();
    }

    onKeyDown = event => {

        if(event.key == 'Enter') {
            this.handleBlur(event);
        }
    }

    handleBlur = (event) => {

        const { validationList, validation, identifier, onBlur } = this.props;
        const value = event.target.value;

        if(onBlur) onBlur();    
        if(validation) validation(value, identifier, validationList);
    }

    getInput() {
        return this.input;
    }

    render() {

        const { className, style, name, mandatory, readOnly, placeholder, validationStatus, isHorizontal, inputType, inputMask, hideHeader, value, } = this.props;
        const componentStyle = { ...style, };

        return <div className={`input input-text ${className} ${validationStatus || ''}`} style={componentStyle}>
            {
                !isHorizontal && !hideHeader ?
                <div className="input-header">
                    {name ? <Label text={name} /> : null}
                    {mandatory? <Label className='input-label-required' textStyle={ !validationStatus || validationStatus == 'error' ? {color: '#cc0000'} : null } text="*  required" /> : null}
                    <SubmitStatusIcon status={validationStatus} style={{marginLeft: '5px'}}/>
                </div> :
                null
            }
            {

                inputMask ?
                <MaskedTextInput
                    className='input-field'
                    mask={inputMask}
                    guide={false}
                    disabled={readOnly}
                    type={inputType || 'text'}
                    value={value}
                    placeholder={placeholder}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    onFocus={this.handleFocus}
                    onKeyDown={this.onKeyDown}
                    
                /> :
                <input
                    className='input-field'
                    ref={r => this.input = r}
                    disabled={readOnly}
                    type={inputType || 'text'}
                    value={value}
                    placeholder={placeholder}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    onFocus={this.handleFocus}
                    onKeyDown={this.onKeyDown}
                    
                />
            }

        </div>;
    }
}

export default InputText;
