import './inputTime.scss';
import React, { Component } from 'react';
import { string, bool, any, func, array, object } from 'prop-types';
//import moment from 'moment';
import { Label, Button } from 'views/components';
import MaskedTextInput from 'react-text-mask';

class InputTime extends Component {

  static defaultProps = {
    className: '',
    identifier: null,
    validationStatus: null,
    inputMask: [/\d/, /\d/, ':', /\d/, /\d/],
  }

  static propTypes = {
    className: string,
    style: object,
    name: string,
    validation: func,
    identifier: any,
    validationStatus: string,
    inputMask: array,
    value: string,
    validationList: array,
    readOnly: bool,
    mandatory: bool,
    placeholder: string,
  }

  state = {
    format: 'AM',
    value: this.props.value || '',
    focused: false,
  }

  handleChange = event => {
    this.setState({
      value: event.target.value,
      hasChanges: true
    });
  }


  handleFocus = () => {

      if(this.props.onFocus) {
          this.props.onFocus()
      }
      
    this.setState({
      focused: true
    });
  }

  onKeyDown = event => {
    if(event.key == 'Enter') {
        this.handleBlur();
    }
  }

  handleBlur = () => {

      if(this.props.onBlur) {
          this.props.onBlur()
      }

    const { validationList, validation, identifier } = this.props;
    const { format, value } = this.state;
    const time = value.concat(' ', format);
    this.setState({ focused: false });
    if(validation) validation(time, identifier, validationList);
  }


  toggleFormat = () => {
    this.setState({
      format: this.state.format == 'AM' ? 'PM' : 'AM'
    });
    this.handleBlur();
  }

  render() {

    const { className, style, validationStatus, name, readOnly, placeholder, inputMask, mandatory } = this.props;
    const { focused, value, format } = this.state;
    const componentStyle = { ...style, };

    return (
      <div className={`input input-time ${className} ${validationStatus || ''}`}>
        { name ? <div className='input-header'>
          { name ? <Label className="input-time-label" text={name} /> : null }
          { mandatory ? <Label className='input-label-required' textStyle={{color: '#cc0000'}} text="*  required" /> : null}
        </div> : null }
        <div className='input-time-main'>
          <MaskedTextInput
              mask={inputMask}
              guide={false}
              disabled={readOnly}
              value={value}
              placeholder={placeholder}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              onFocus={this.handleFocus}
              onKeyDown={this.onKeyDown}
              style={focused ? { borderColor: componentStyle.color } : null}
          />
          <Button className="input-time-button" onClick={this.toggleFormat}>{format}</Button>
        </div>
      </div>
    );
  }
}

export default InputTime;
