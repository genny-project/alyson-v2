import './inputCheckbox.scss';
import React, { Component } from 'react';
import { string, any, bool, func, array, object } from 'prop-types';
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
    style: object,
    children: any,
    checked: bool,
    validation: func,
    identifier: any,
    validationStatus: string,
    handleOnChange: func,
    validationList: array,
    name: string,
    html: string,
    mandatory: bool
  }

  state = {
  }

  handleChange = (event) => {
    const { validationList, validation, identifier, handleOnChange } = this.props;
    const value = event.target.checked;

    if(handleOnChange) handleOnChange(value);
    if(validation) {
      clearTimeout(this.state.timer);
      this.state.timer = setTimeout(() => {
        validation(value, identifier, validationList);
      }, 1000);
    }
  }

  render() {
    const { className, name, checked, html, mandatory } = this.props;

    return (
      <div className={`input input-checkbox ${className}`}>
        <input type="checkbox" checked={checked} onChange={this.handleChange}/>
        { html && ( <div className="checkbox-label label-html" dangerouslySetInnerHTML={{ __html: html }} /> ) }
        { !html && name && ( <Label className="checkbox-label" text={name}/> ) }
        { mandatory ? <Label className='input-label-required' textStyle={ !this.props.validationStatus ? {color: '#cc0000'} : null} text="*  required" /> : null}
      </div>
    );
  }
}

export default InputCheckbox;
