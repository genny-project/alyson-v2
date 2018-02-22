import './passcodeInput.scss';
import React, { Component } from 'react';
import { string, object, func, number } from 'prop-types';

class PasscodeInput extends Component {

  static defaultProps = {
    className: '',
    placeholder: '-',
    maxLength: 1
  }

  static propTypes = {
    className: string,
    style: object,
    value: string,
    placeholder: string,
    maxLength: number,
    onChange: func,
  }

  state = {
    currentValue: ''
  }

  static focus() {
    if(this.input) {
      this.input.focus();
    }
  }

  handleChange = (event) => {
    const value = event.target.value;

    if (value && value.length > 0) {
      
      if (this.state.currentValue < this.props.maxLength) {
        this.setState({
          currentValue: value
        });
      }
      else if (value >= this.props.maxLength) {
        console.log(value, value.length, value.charAt(value.length-1) );
        this.setState({
          currentValue: value.charAt(value.length)
        });
      }
    }
  }

  render() {
    const { className, style, placeholder, key} = this.props;
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
          tabIndex={key}
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
