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
    InputSearch,
    InputSlider,
    InputTerms,
    InputText,
    InputTextarea,
    InputTime,
    InputUpload,
    InputUploadPhoto,
    InputPayment,
    InputTags
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

        if (this.props.onMount) {
            let isValid = this.isValid();
            this.props.onMount(this.props.identifier, this.props.value, isValid);
        }
    }

    shouldComponentUpdate(nextProps) {

        //if (this.state.value == null && nextProps.value === this.props.value) return false;
        if(this.state.isFocused === true && this.didReceiveNewProps == true) return false;
        return true;

        // if(nextProps.value == null || value == null || nextProps.value.length == 0 || value.length == 0) {
        //     return true;
        // }
        // return value == null ? true : value != nextProps.value;
    }

    componentWillUpdate() {
        this.state.validationStatus = 'normal';
    }

    isValid = (showStyle) => {


        const { validationList, mandatory } = this.props;
        const { value } = this.state;

        let isValid = false;

        //console.log(value, validationList, mandatory);

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

     componentDidUpdate() {

       this.didReceiveNewProps = false;
     }

    componentWillReceiveProps(newProps) {

        const { isFocused } = this.state;

        if(this._ismounted && isFocused != true) {

            this.didReceiveNewProps = true;
            this.setState({
                value: newProps.value
            });
        }
    }

    handleOnChange = (newValue) => {

        this.didReceiveNewProps = false;
        this.setState({
            value: newValue
        });
    }

    validateInput = (value, identifier, validationList) => {

        if(value == this.props.value && value.constructor != Boolean) return;

        this.state.value = value;

        const valResult = this.isValid();

        this.validateValue(valResult, value);
    }

    validateValue = ( valResult, value ) => {
        if ( valResult ){
            this.validationStyle('success');
            if(this.props.onValidation) this.props.onValidation(value, this.props.data, this.props.mandatory, valResult, this.props.identifier);
        }
        else if (this.props.mandatory && ( value == null || value.length == 0 ) ) {
            this.validationStyle('success');
            if(this.props.onValidationFail) this.props.onValidationFail(this.props.value, this.props.data, this.props.mandatory, true, this.props.identifier);
        }
        else {
            this.validationStyle('error');
            if(this.props.onValidationFail) this.props.onValidationFail(value, this.props.data, this.props.mandatory, valResult, this.props.identifier);
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

        const { identifier, ...rest } = this.props;
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
                    className={identifier}
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
                    className={identifier}
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
                    className={identifier}
                    handleOnChange={this.handleOnChange}
                    showTimeSelect={false}
                    inputMask={this.props.inputMask}
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
                    className={identifier}
                    onBlur={this.onBlur}
                    value={this.state.value}
                    handleOnChange={this.handleOnChange}
                />
            );

            case 'Tag':
            return (
                <InputTags
                    {...rest}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                    onFocus={this.onFocus}
                    className={identifier}
                    onBlur={this.onBlur}
                    value={this.state.value}
                    handleOnChange={this.handleOnChange}
                />
            );

            case 'java.lang.Boolean':
            return (
                <InputRadio
                    {...rest}
                    validation={this.validateInput}
                    validationStatus={validationStatus}
                    className={identifier}
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
                    className={identifier}
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
                    className={identifier}
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
                    className={identifier}
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
                    className={identifier}
                    validationStatus={validationStatus}
                />
            );
            case 'Event Button':
            return (
                <InputButton
                    {...rest}
                    onClick={this.props.onClickEvent}
                    className={identifier}
                />
            );
            case 'Answer Button':
            case 'Button':
            return (
                <InputButton
                    {...rest}
                    onClick={this.props.onClick}
                    className={identifier}
                />
            );
            case 'Time':
            return (
                <InputTime
                    {...rest}
                    validation={this.validateInput}
                    className={identifier}
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
                    className={identifier}
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
                    className={identifier}
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
                    className={identifier}
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
                    className={identifier}
                    handleOnChange={this.handleOnChange}
                    //value={this.state.value}
                />
            );
            case 'Payment':
            return (
                <InputPayment
                  {...rest}
                  validation={this.validateInput}
                  validationStatus={validationStatus}
                  className={identifier}
                  value={this.state.value}
                />
            );
            case 'TermsandConditions':
            return (
                <InputTerms
                    {...rest}
                    validation={this.validateInput}
                    className={identifier}
                    validationStatus={validationStatus}
                    value={this.state.value == true ? true : false}
                    handleOnChange={this.handleOnChange}
                />
            );
            case 'Search' :
            return (
                <InputSearch
                    {...rest}
                    handleOnChange={this.handleOnChange}
                    value={this.state.value}
                    className={identifier}
                    validation={this.validateInput}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                />
            );
            default:
            return (
                <InputText
                    {...rest}
                    validation={this.validateInput}
                    className={identifier}
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
