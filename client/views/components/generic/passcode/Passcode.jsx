import './passcode.scss';
import React, { Component } from 'react';
import { string, object, any, number, bool, func } from 'prop-types';
import { PasscodeInput } from './passcode-input';
import _ from 'lodash';

class Passcode extends Component {

  static defaultProps = {
    className: '',
    placeholder: '-',
    totalInputs: 4,
    maxLength: 1,
    clearOnFocus: true,
    disabled: false
  }

  static propTypes = {
    className: string,
    style: object,
    children: any,
    value: string,
    placeholder: string,
    totalInputs: number,
    maxLength: number,
    clearOnFocus: bool,
    onComplete: func,
    disabled: bool
  }

  state = {
    currentValues: {}
  }

  inputs = {};

  handleChange = (index) => (value) => {
    
    this.setState(prevState => ({
      currentValues: {
        ...prevState.currentValues,
        [index]: value
      }
    }), () => {

      if (this.inputs[index + 1]) {
        this.inputs[index + 1 ].input.focus();
      }
      else if ( this.inputs[index] && !this.inputs[index + 1] && index == this.props.totalInputs - 1) {
        this.inputs[index].input.blur();
        this.handleComplete(this.state.currentValues);
      }

    });
  }

  handleComplete = (valueObject) => {
    let valueString = Object.values(valueObject).join('');
    if (this.props.onComplete && valueString.length == this.props.totalInputs ) this.props.onComplete(valueString);
  }


  renderInputs = () => {

    const { totalInputs, placeholder, maxLength, clearOnFocus, disabled } = this.props;
    
    let inputs = [];

    _.range(totalInputs).map((input, index) => {
      inputs.push(
        <PasscodeInput
          ref={(input) => this.inputs[index] = input }
          key={index}
          maxLength={maxLength}
          placeholder={placeholder}
          disabled={disabled}
          clearOnFocus={clearOnFocus}
          onChange={this.handleChange(index)}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onKeyDown={this.onKeyDown}
        />    
      );
    });
    return inputs;
  }

  render() {
    const { className, style, } = this.props;
    const componentStyle = { ...style, };

    return (
      <div className={`passcode ${className}`} style={componentStyle}>
        <div className='passcode-inputs'>
          {this.renderInputs()}
        </div>
      </div>
    );
  }
}

export default Passcode;
