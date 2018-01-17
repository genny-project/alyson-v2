import './input.scss';
import React, { Component } from 'react';
import { string, func } from 'prop-types';
import {
    InputAddress,
    InputButton,
    InputCheckbox,
    InputNumbers,
    InputDate,
    InputDatePicker,
    InputDropdown,
    InputEmail,
    InputSlider,
    InputText,
    InputTextarea,
    InputTime,
    InputUpload,
    InputUploadPhoto,

} from 'views/components';

class Input extends Component {

    static defaultProps = {
        className: '',
        type: '',
        value: '',
    }

    static propTypes = {
        className: string,
        type: string,
        value: string,
        onValidation: func,
        onValidationFailure: func,
    }

    state = {
        validationStatus: this.props.value ? 'success' : null,
        value: this.props.value || '',
    }

    componentDidMount() {
        this._ismounted = true;
    }

    shouldComponentUpdate() {
        return true;
    }

    componentWillUpdate() {
        this.state.validationStatus = 'normal';
    }

    isValid = () => {

        const { validationList } = this.props;
        const { value } = this.state;

        let isValid = false;
        if (validationList.length > 0) {
            isValid = validationList.every( validation => new RegExp(validation.regex).test( value ));
        }
        else {
            isValid = new RegExp(/.*/).test( value );
        }

        if(isValid) {
            this.validationStyle('success');
        }
        else {
            this.validationStyle('error');
        }

        return isValid;
    }

    componentWillReceiveProps(newProps) {

        if(this._ismounted) {

            this.setState({
                value: newProps.value
            })
        }
    }

    handleOnChange = (newValue) => {
        this.setState({
            value: newValue
        });
    }

    validateInput = (value, identifier, validationList) => {

        if(value == this.props.value) return;

        if ( validationList.length > 0) {

            const valResult = validationList.every( validation => new RegExp(validation.regex).test( value ));
            this.validateValue(valResult, value);

        }
        else {

            const valResult = new RegExp(/.*/).test( value );
            this.validateValue(valResult, value);

        }
    }

    validateValue = ( valResult, value ) => {

        if ( valResult ){

            this.validationStyle('success');
            if(this.props.onValidation) this.props.onValidation(value, this.props.data, this.props.mandatory);
        }
        else {

            this.validationStyle('error');
            if(this.props.onValidationFailure) this.props.onValidationFailure(this.props.data, this.props.mandatory);
        }
    }

    validationStyle = (resultString) => {

        if(this._ismounted) {
            this.setState({
                validationStatus: resultString,
            });
        }
    }

    renderInput() {

        const { onClick, onClickEvent, style, ...rest } = this.props;
        const { validationStatus } = this.state;
        let items = this.props.options;

        switch(this.props.type) {

            // socials
            case 'Facebook':
            return (
                <InputButton
                    {...rest}
                    onClick={this.props.onClickEvent}
                    className="facebook"
                    name=""
                    type="facebook"
                />
            );
            case 'java.time.LocalDateTime':
            return (
                <InputDatePicker
                    {...rest}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                    value={this.state.value}
                    handleOnChange={this.handleOnChange}
                />
            );
            case 'java.time.LocalDate':
            return (
                <InputDatePicker
                    {...rest}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                    value={this.state.value}
                    handleOnChange={this.handleOnChange}
                    showTimeSelect={false}
                    defaultDateFormat='YYYY-MM-DD'
                />
            );
            case 'TextArea':
            return (
                <InputTextarea
                    {...rest}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                />
            );
            case 'java.lang.Boolean':
            return (
                <InputCheckbox
                    {...rest}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                    value={this.state.value}
                    handleOnChange={this.handleOnChange}
                />
            );
            case 'dropdown':
            return (
                <InputDropdown
                    {...rest}
                    items={items}
                    isSingleSelect
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                />
            );
            case 'dropdownmultiple':
            return (
                <InputDropdown
                    {...rest}
                    items={items}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                />
            );
            case 'slider':
            return (
                <InputSlider
                    {...rest}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                />
            );
            case 'upload-photo':
            return (
                <InputUploadPhoto {...rest} />
            );
            case 'Upload':
            return (
                <InputUpload
                    {...rest}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                />
            );
            case 'Event Button':
            return (
                <InputButton
                    {...rest}
                    onClick={this.props.onClickEvent}
                />
            );
            case 'Answer Button':
            case 'Button':
            return (
                <InputButton
                    {...rest}
                    onClick={this.props.onClick}
                />
            );
            case 'Time':
            return (
                <InputTime
                    {...rest}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                />
            );
            case 'Address':
            return (
                <InputAddress
                    {...rest}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                />
            );
            case 'Double':
            case 'Currency':
            return (
                <InputNumbers
                    {...rest}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                    value={this.state.value}
                    prefix={this.props.type == "Currency" ? "$" : ''}
                />
            );
            case 'Email':
            return (
                <InputEmail
                    {...rest}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                    value={this.state.value}
                />
            );
            default:
            return (
                <InputText
                    {...rest}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                    handleOnChange={this.handleOnChange}
                    value={this.state.value}
                />
            );
        }
    }

    render() {
        return <div style={this.props.style}>{this.renderInput()}</div>;
    }
}

export default Input;
