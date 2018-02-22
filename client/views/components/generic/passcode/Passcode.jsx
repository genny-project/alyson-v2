import './passcode.scss';
import React, { Component } from 'react';
import { string, object, any, number } from 'prop-types';
import { PasscodeInput } from './passcode-input';
import _ from 'lodash';

class Passcode extends Component {

  static defaultProps = {
    className: '',
    placeholder: '-',
    totalInputs: 4
  }

  static propTypes = {
    className: string,
    style: object,
    children: any,
    value: string,
    placeholder: string,
    totalInputs: number
  }

  state = {
    currentValues: {}
  }

  inputs = {};

  handleChange = (index) => (event) => {
    if (this.inputs[index + 1]) {
      this.inputs[index + 1 ].input.focus();
    }
    
    const value = event.target.value;
    
    this.setState(prevState => ({
      currentValues: {
        ...prevState.currentValues,
        [index]: value
      }
    }));
  }

  renderInputs = () => {

    const { totalInputs, value, placeholder } = this.props;
    
    let inputs = [];

    _.range(totalInputs).map((input, index) => {
      inputs.push(
        <PasscodeInput
          ref={(input) => this.inputs[index] = input }
          key={index}
          onChange={this.handleChange(index)}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onKeyDown={this.onKeyDown}
          onMaxLength={this.handleMaxLength}
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
