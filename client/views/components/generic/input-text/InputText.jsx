import './inputText.scss';
import React, { Component } from 'react';
import { string, bool, array, object, int, any, func } from 'prop-types';
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

    handleOnChange: func,
  }

  state = {
    date: new Date(),
    hasChanges: false,
    focused: false,
  }

  handleChange = event => {

    const { handleOnChange } = this.props;
    const value = event.target.value;
    
    if(handleOnChange) handleOnChange(value);

  }

  handleFocus = event => {
    this.setState({
      focused: true
    });
  }

  onKeyDown = event => {

    if(event.key == 'Enter') {
        this.handleBlur(event);
    }
  }

  handleBlur = (event) => {

    const { validationList, validation, identifier } = this.props;
    const value = event.target.value;
    this.setState({
      focused: false
    });
    if(validation) validation(value, identifier, validationList);
  }

  getInput() {
    return this.input;
  }

  render() {

    const { className, style, name, mandatory, readOnly, placeholder, validationStatus, isHorizontal, inputType, inputMask, hideHeader, value, ...rest } = this.props;
    const componentStyle = { ...style, };
    const { date, focused } = this.state;

    return <div className={`input input-text ${className} ${validationStatus || ''}`} style={componentStyle}>
      {
        !isHorizontal && !hideHeader ? 
          <div className="input-header">
            {name ? <Label text={name} /> : null}
            {mandatory? <Label className='input-label-required' textStyle={ !validationStatus ? {color: '#cc0000'} : ''} text="*  required" /> : null}
            <SubmitStatusIcon status={validationStatus} style={{marginLeft: '5px'}}/>
          </div> :
        null
      }
      {

        inputMask ?
        <MaskedTextInput
          mask={inputMask}
          guide={false}
          disabled={readOnly}
          type={inputType || "text"}
          value={value}
          placeholder={placeholder}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onKeyDown={this.onKeyDown}
          style={focused ? { borderColor: componentStyle.color } : null}
        /> :
        <input
          ref={r => this.input = r}
          disabled={readOnly}
          type={inputType || "text"}
          value={value}
          placeholder={placeholder}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onKeyDown={this.onKeyDown}
          style={focused ? { borderColor: componentStyle.color } : null}
        />
      }

    </div>;
  }
}

export default InputText;
