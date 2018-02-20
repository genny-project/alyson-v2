import './input.scss';
import React, { Component } from 'react';
import { string, func, array, object, any, bool } from 'prop-types';
import {
    InputAddress,
    InputButton,
    InputCheckbox,
    InputNumbers,
    InputDatePicker,
    InputDropdown,
    InputEmail,
    InputRadio,
    InputRating,
    InputSlider,
    InputTerms,
    InputText,
    InputTextarea,
    InputTime,
    InputUpload,
    InputUploadPhoto,
    InputPayment,
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
        validationList: array,
        onClick: func,
        onClickEvent: func,
        style: object,
        options: array,
        data: any,
        mandatory: bool,
    }

    state = {
        validationStatus: this.props.value ? 'success' : null,
        value: this.props.value,
        isFocused: false,
    }

    componentDidMount() {
        this._ismounted = true;
    }

    shouldComponentUpdate(nextProps) {

        return true;
        
        const { value } = this.state;
        if(nextProps.value == null || value == null || nextProps.value.length == 0 || value.length == 0) {
            return true;
        }
        return value == null ? true : value != nextProps.value;
    }

    componentWillUpdate() {
        this.state.validationStatus = 'normal';
    }

    isValid = (showStyle) => {

        const { validationList, mandatory } = this.props;
        const { value } = this.state;

        let isValid = false;

        //sconsole.log(validationList, value, mandatory);

        // if there is validation required
        if ( mandatory || !mandatory && value != null && value.length > 0) {
            if (validationList.length > 0) {

                // check against all validation
                isValid = validationList.every( validation => {

                    // if passes all, return true, otherwise, return false.
                    //console.log('regex validation', new RegExp(validation.regex).test( value ));

                    return new RegExp(validation.regex).test( value );
                });
                return isValid;
            }
            //if there is no validation
            else {
                // check if value is not null, and if value is greater than 0
                isValid = value != null && value.length > 0;
            }
        }
        else {

            //if(showStyle) this.validationStyle('success');

            return true;
        }

        if(showStyle == true || showStyle == null) {

            if(isValid) {
                this.validationStyle('success');
            }
            else {
                this.validationStyle('error');
            }
        }
        //console.log(isValid);
        return isValid;
    }

    componentWillReceiveProps(newProps) {
        const { isFocused } = this.state;

        if(this._ismounted && isFocused != true) {
            this.setState({
                value: newProps.value
            });
        }
    }

    handleOnChange = (newValue) => {

        this.setState({
            value: newValue
        });
    }

    validateInput = (value, identifier, validationList) => {

        if(value == this.props.value && value.constructor != Boolean) return;

        this.state.value = value;

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

    onFocus = () => {
        this.state.isFocused = true;
    }

    onBlur = () => {
        this.state.isFocused = false;
    }

    renderInput() {

        const { ...rest } = this.props;
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
                    dateDisplayFormat={window.getScreenSize() == 'sm' ? 'yyyy-MM-dd' : 'YYYY-MM-DD'}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
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
                    dateDisplayFormat={window.getScreenSize() == 'sm' ? 'yyyy-MM-dd' : 'YYYY-MM-DD'}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                />
            );
            case 'TextArea':
            return (
                <InputTextarea
                    {...rest}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    value={this.state.value}
                    handleOnChange={this.handleOnChange}
                />
            );
            // case 'java.lang.Boolean':
            // return (
            //     <InputCheckbox
            //         {...rest}
            //         validation={this.validateInput}
            //         validationStatus={validationStatus}
            //         value={this.state.value}
            //         handleOnChange={this.handleOnChange}
            //         checked={this.state.value != null && this.state.value == 'true' || this.state.value != null && this.state.value == true ? true : false}
            //     />
            // );


            case 'java.lang.Boolean':
            return (
                <InputRadio
                    {...rest}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                    handleOnChange={this.handleOnChange}
                    value={this.state.value != null ? this.state.value : false}
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
                    value={this.state.value}
                    // onFocus={this.onFocus}
                    // onBlur={this.onBlur}
                />
            );
            case 'dropdownmultiple':
            return (
                <InputDropdown
                    {...rest}
                    items={items}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                    // onFocus={this.onFocus}
                    // onBlur={this.onBlur}
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
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                />
            );
            case 'Address':
            return (
                <InputAddress
                    {...rest}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                />
            );
            case 'Double':
            case 'Currency':
            case 'org.javamoney.moneta.Money':
            return (
                <InputNumbers
                    {...rest}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                    value={this.state.value}
                    prefix={this.props.type == 'Currency' ? '$' : ''}
                    handleOnChange={this.handleOnChange}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                />
            );
            case 'Email':
            return (
                <InputEmail
                    {...rest}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                    value={this.state.value}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                />
            );
            case 'Rating':
            return (
                <InputRating
                    {...rest}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                    handleOnChange={this.handleOnChange}
                    value={this.state.value}
                />
            );
            case 'Payment':
            return (
                <InputPayment
                  {...rest}
                  validation={this.validateInput}
                  validationStatus={validationStatus}
                  value={this.state.value}
                />
            );
            case 'TermsandConditions':
            return (
                <InputTerms
                    {...rest}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                    value={this.state.value == true ? true : false}
                    handleOnChange={this.handleOnChange}
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
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                />
            );
        }
    }

    render() {
        return <div style={this.props.style}>{this.renderInput()}</div>;
    }
}

export default Input;
