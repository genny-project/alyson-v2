import './inputTime.scss';
import React, { Component } from 'react';
import { string, object, any, func, array } from 'prop-types';
import moment from 'moment';
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
    style: string,
    children: any,
    validation: func,
    identifier: any,
    validationStatus: string,
    inputMask: array
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


  handleFocus = event => {
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

    const { validationList, validation, identifier } = this.props;
    const { format, value } = this.state;
    const time = value.concat(' ', format);
    this.setState({ focused: false });
    if(validation) validation(time, identifier, validationList);
  }


  toggleFormat = () => {
    this.setState({
      format: this.state.format == 'AM' ? 'PM' : 'AM'
    })
    this.handleBlur();
  }

  render() {

    const { className, children, style, validationStatus, name, readOnly, placeholder, inputMask, mandatory } = this.props;
    const { focused, value, format } = this.state;
    const componentStyle = { ...style, };

    return (
      <div className={`input input-time ${className} ${validationStatus || ''}`}>
        { name ? <div className='input-header'>
          { name ? <Label className="input-time-label" text={name} /> : null }
          { mandatory ? <Label className='input-label-required' style={{ marginRight: '10px'}} textStyle={{color: '#cc0000'}} text="*  required" /> : null}
        </div> : null }
        <div className='input-time-main'>
          <MaskedTextInput
              mask={inputMask}
              guide={true}
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
