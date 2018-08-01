import './inputDatePicker.scss';
import 'react-datepicker/dist/react-datepicker.css';

import React, { Component } from 'react';
import { string, object, any, func, bool, array } from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Label, SubmitStatusIcon } from 'views/components';

class InputDatePicker extends Component {

    static defaultProps = {
        className: '',
        identifier: null,
        validationStatus: null,
        showTimeSelect: true,
        dateTimeDisplayFormat: 'YYYY-MM-DD HH:mm',
        dateDisplayFormat: 'yyyy-MM-dd',
        timeDisplayFormat: 'HH:mm',
    }

    static propTypes = {
        className: string,
        style: object,
        name: string,
        validation: func,
        identifier: any,
        validationStatus: string,
        validationList: array,
        value: string,
        mandatory: bool,
        showTimeSelect: bool,

        type: string,

        dateTimeDisplayFormat: string,
        dateDisplayFormat: string,
        timeDisplayFormat: string,
        handleOnChange: func,
    }

    state = {
        shouldValidate: true,
        isMobile: window.getScreenSize() == 'sm',
        currentValue: null,
        lateSentValue: null,
        browser: navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1 ? 'SAFARI' : navigator.userAgent.indexOf('Firefox') != -1 ? 'FIREFOX' : 'CHROME',
    }

    //setInitial Value
    componentWillMount() {
        const { value } = this.props;
        
        this.setupComponent(value);
    }

    setupComponent = (value) => {
        if ( value != null && value != '' ) {
            let newValue = value;

            if(!newValue.endsWith('Z')) {
                if ( this.props.type == 'java.time.LocalDate') {
                    newValue = `${newValue}T00:00:00Z`;                
                }
                else {
                    newValue = `${newValue}Z`;
                }
            }
            
            const date = moment(new Date( newValue ));
            
            this.setState({
                currentValue: date,
                lastSentValue: date
            }, () => {
                //console.log('process:', date);
                const convertedDate = this.convertToDataFormat(date);
                this.validateDate(convertedDate, true);
            });
        }
        else {

            this.setState({
                currentValue: null,
                lastSentValue: null
            });
        }
    }

    componentWillReceiveProps( nextProps) {
        if ( nextProps.value != this.props.value) {
            if (nextProps.value != null && nextProps.value != '' ) {
                
                let newValue = nextProps.value;

                if(!newValue.endsWith('Z')) {
                    if ( this.props.type == 'java.time.LocalDate') {
                        newValue = `${newValue}T00:00:00Z`;                
                    }
                    else {
                        newValue = `${newValue}Z`;
                    }
                }
                
                const date = moment(new Date( newValue ));

                this.setState({
                    currentValue: date,
                }, () => {
                    //console.log('process:', date);
                    const convertedDate = this.convertToDataFormat(date);
                    this.validateDate(convertedDate, true);
                });
            }
            else {
                this.setState({
                    currentValue: null,
                    lastSentValue: null
                });
            }
        }
    }

    convertToDataFormat = (date) => {

        const { type } = this.props;
        let preFormattedDate = date;
  
        if (this.props.value === '' || this.props.value === null) {
            if (type == 'java.time.LocalDate') {
                preFormattedDate = moment(date).format('YYYY-MM-DD');
            } else {
                preFormattedDate = moment(date).format();
            }
  
            if ( type == 'java.time.LocalDate') {
                preFormattedDate = `${preFormattedDate}T00:00:00Z`;                
            }
            else {
                preFormattedDate = `${preFormattedDate}Z`;
            }
  
            preFormattedDate = moment(new Date(preFormattedDate));
        }

        let dataFormat;
        if (type == 'java.time.LocalDate') {
                dataFormat = moment.utc(preFormattedDate).format('YYYY-MM-DD');
        }
        else {
            dataFormat = moment.utc(preFormattedDate).format();
        }
        return dataFormat;
    }

    handleChangeMobile = field => (event) => {

        const { value } = event.target;
        const { currentValue } = this.state;
        let date;

        if ( field === 'time' ) {
            const hours = value.split( ':' )[0];
            const minutes = value.split( ':' )[1];

            date = currentValue ? new Date( currentValue ) : new Date();
            date.setHours( hours, minutes );
        }
        else {
            date = new Date( value );
        }

        this.setState({ currentValue: new Date( date ) }, () => {

            const formatted = this.convertToDataFormat( this.state.currentValue );
            this.changeValueProp( formatted );
        });
    }

    handleBlur = (value) => {

    }

    changeValueProp = (value) => {
        const { handleOnChange, validation } = this.props;
        const { shouldValidate, lastSentValue, isMobile } = this.state;
        // console.log(value);
        
        let sentValue = this.convertToDataFormat(value);
        // console.log('value', value, sentValue);

        handleOnChange(sentValue);
        
        if (validation && shouldValidate) {
            if (sentValue != lastSentValue || isMobile ) {
                this.validateDate(sentValue);
            }
        }

        this.setState({
            lastSentValue: value
        });
    }

    validateDate = (value, validatePropValue) => {
        const { validation, identifier, validationList} = this.props;
        // console.log('validate:', value);
        validation(value, identifier, validationList, validatePropValue);
    }

    getDateRange = (data) => {

        if (data && data.length == 2) {
            let min = this.getDateRangeContent(data[0]);
            let max = this.getDateRangeContent(data[1]);

            if (min && max && min.isBefore(max)){
                return { minDate: min, maxDate: max };
            } else if (!min || !max) {
                return { minDate: min, maxDate: max };
            }
        }
        return { minDate: false, maxDate: false };
    }

    getDateRangeContent = (data) => {
        let value = moment(data, 'YYYY-MM-DD', true);
        if (value.isValid()) {
            return value;
        }
        else if (Number.isInteger(parseInt(data))){
            return moment().add(data, 'years');
        }
        return false;
    }

    render() {
        const { className, style, validationStatus, name, type, mandatory, showTimeSelect, dateTimeDisplayFormat, dateDisplayFormat, timeDisplayFormat, inputMask } = this.props;
        const { currentValue, isMobile } = this.state;
        const componentStyle = { ...style, };
        const dateRange = this.getDateRange(inputMask);
        // console.log(currentValue);
        return (
            <div className={`input input-date-picker ${className} ${isMobile ? `${validationStatus} mobile` : ''} `} style={componentStyle}>
                { name ? <div className='input-header'>
                    { name && <Label className="input-date-picker-label" text={name} /> }
                    { mandatory ? <Label className='input-label-required' textStyle={ !validationStatus ? {color: '#cc0000'} : null} text="*  required" /> : null}
                    <SubmitStatusIcon status={validationStatus} style={{ marginLeft: '5px' }} />
                </div> : null }
                {
                isMobile ?
                    <div className='input-date-picker-mobile' style={{display: 'flex'}}>
                        <input
                            type='date'
                            className='input-field'
                            onChange={this.handleChangeMobile( 'date' )}
                            min={dateRange.minDate && dateRange.minDate.format( 'YYYY-MM-DD' )}
                            max={dateRange.maxDate && dateRange.maxDate.format( 'YYYY-MM-DD' )}
                            value={currentValue ? moment( currentValue ).format( 'YYYY-MM-DD' ) : null}
                        />
                        { type == 'java.time.LocalDate' ? null :
                            <input
                            type='time'
                            className='input-field'
                            onChange={this.handleChangeMobile( 'time' )}
                            // onBlur={this.handleChangeMobile}
                            // onKeyDown={this.handleChangeMobile}
                            value={currentValue ? moment( currentValue ).format( 'HH:mm' ) : null}
                            />
                        }
                    </div>

                    : ( <DatePicker
                            className={`${validationStatus} input-field`}

                            dateFormat={(type == 'java.time.LocalDateTime') ? dateTimeDisplayFormat : dateDisplayFormat }
                            timeFormat={timeDisplayFormat}
                            selected={currentValue != null ? moment( currentValue ) : null}

                            onChange={this.changeValueProp}

                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            minDate={dateRange.minDate}
                            maxDate={dateRange.maxDate}
                            dropdownMode="select"
                            showTimeSelect={showTimeSelect}
                            timeIntervals={15}
                        />
                    )
                }
            </div>
        );
    }
}

export default InputDatePicker;
