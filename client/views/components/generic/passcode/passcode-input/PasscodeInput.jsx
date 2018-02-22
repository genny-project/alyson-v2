import './passcodeInput.scss';
import React, { Component } from 'react';
import { string, object, func, number, bool } from 'prop-types';

class PasscodeInput extends Component {

  static defaultProps = {
    className: '',
    placeholder: '-',
    maxLength: 1,
    clearOnFocus: true,
    disabled: false
  }

  static propTypes = {
    className: string,
    style: object,
    value: string,
    placeholder: string,
    maxLength: number,
    onChange: func,
    clearOnFocus: bool,
    disabled: bool,
  }

  state = {
    currentValue: ''
  }

  static focus() {
    if(this.input) {
      this.input.focus();
    }
  }

  static blur() {
    if(this.input) {
      this.input.blur();
    }
  }

  handleChange = (event) => {
    let value = event.target.value;

    //console.log('value', value);
    if (value && value.length > 0) {
      
      //console.log('currentValue', this.state.currentValue, 'maxLength', this.props.maxLength);
      if (value <= this.props.maxLength) {
        this.setState({
          currentValue: value
        });
      }
      else if (value > this.props.maxLength) {
        value = value.charAt(value.length - 1);
        this.setState({
          currentValue: value
        });
      }
    }
    if (this.props.onChange) this.props.onChange(value);
  }

  handleFocus = () => {
    if (this.props.clearOnFocus) {
      this.setState({
        currentValue: ''
      });
    }
  }

  render() {
    const { className, style, placeholder, disabled } = this.props;
    const { currentValue } = this.state;
    const componentStyle = { ...style, };

    return (
      <div className={`passcode-input ${className}`} style={componentStyle}>
        <input
          className={currentValue && currentValue.length > 0 ? 'has-value' : ''}
          type='tel'
          required
          value={currentValue}
          ref={r => this.input = r}
          disabled={disabled}
          placeholder={placeholder}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onKeyDown={this.onKeyDown}
        />
      </div>
    );
  }
}

export default PasscodeInput;
