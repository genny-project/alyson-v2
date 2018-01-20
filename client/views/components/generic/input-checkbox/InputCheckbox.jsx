import './inputCheckbox.scss';
import React, { Component } from 'react';
import { string, any, bool, func, array } from 'prop-types';
import { Label } from 'views/components';

class InputCheckbox extends Component {

  static defaultProps = {
    className: '',
    checked: false,
    identifier: null,
    validationStatus: null
  }

  static propTypes = {
    className: string,
    style: string,
    children: any,
    checked: bool,
    validation: func,
    identifier: any,
    validationStatus: string,
    handleOnChange: func,
    validationList: array,
    name: string,
  }

  state = {
  }

  handleChange = (event) => {
    const { validationList, validation, identifier, handleOnChange } = this.props;
    const value = event.target.checked;

    if(handleOnChange) handleOnChange(value);
    if(validation) {
      clearTimeout(this.state.timer);
      this.state.timer = setTimeout(function(){
        validation(value, identifier, validationList);
      }.bind(this), 1000);
    }
  }

  render() {
    const { className, name, checked } = this.props;

    return (
      <div className={`input-checkbox ${className}`}>
        <input type="checkbox" onChange={this.handleChange}/>
        {name ? <Label className="checkbox-label" text={name} checked={checked} /> : null }
      </div>
    );
  }
}

export default InputCheckbox;
