import './inputText.scss';
import React, { Component } from 'react';
import { string, bool, array } from 'prop-types';
import { Label } from '../';

class InputText extends Component {
  static defaultProps = {
    className: '',
    name: '',
    readOnly: false,
    defaultValue: '',
    optional: false,
    placeholder: '',
    validation: ''
  }

  static propTypes = {
    className: string,
    srcCode: string,
    targetCode: string,
    attributeCode: string,
    dataType: string,
    name: string,
    mask: string,
    validation: array,
    readOnly: bool,
    optional: bool,
    expiry: string,
    placeholder: string,
    defaultValue: string,
  }

  state = {
    value: '',
    mask: this.props.mask,
  }

  handleChange = event => {
    console.log(this.state.mask);
      var re = this.state.mask;
      console.log(re.test(event.target.value));
      if ( re.test(event.target.value) ) {
        this.setState({
          value: event.target.value
        })
      }
  }



  render() {
    const { className, name, readOnly, defaultValue, placeholder, mask, validation, optional} = this.props;
    return (
      <div className={`input-text ${className}`}>
        {name ? <Label text={name} /> : null }
        {optional ? <Label text="(optional)" /> : null}
        <input
          type="text"
          disabled={readOnly}
          defaultValue={defaultValue}
          placeholder={placeholder}
          value={this.state.value}
          onChange={this.handleChange}

        />
      </div>
    );
  }
}

export default InputText;