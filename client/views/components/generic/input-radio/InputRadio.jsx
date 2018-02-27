import './inputRadio.scss';
import React, { Component } from 'react';
import { string, any, bool, func, array, object } from 'prop-types';
import { Label, SubmitStatusIcon } from 'views/components';

class InputRadio extends Component {

  static defaultProps = {
    className: '',
    identifier: null,
    validationStatus: null
  }

  static propTypes = {
    className: string,
    style: object,
    children: any,
    value: bool,
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
    currentSelected: this.props.value
  }

  handleChange = (event) => {
    
    const { validationList, validation, identifier, handleOnChange } = this.props;
    let value;
    if (event.target.value == 'option1') value = true;
    if (event.target.value == 'option2') value = false;

    if(handleOnChange) handleOnChange(value);
    if(validation) validation(value, identifier, validationList);
  }

  render() {
    const { className, name, value, identifier, html, mandatory, isHorizontal, hideHeader, validationStatus } = this.props;

    let isChecked = ( value == ( true || 'true' ) ) ? true : false;

    return (
      <div className={`input input-radio ${className}`}>
        {
          !isHorizontal && !hideHeader ?
          <div className="input-header">
              { html && ( <div className="radio-label label-html" dangerouslySetInnerHTML={{ __html: html }} /> )}
              { !html && name && <Label text={name} /> }
              { mandatory? <Label className='input-label-required' textStyle={ !validationStatus || validationStatus == 'error' ? {color: '#cc0000'} : null } text="*  required" /> : null}
              <SubmitStatusIcon status={validationStatus} style={{marginLeft: '5px'}}/>
          </div> :
          null
        }
        <div className='radio-main'>
          <input type="radio" name={identifier} checked={isChecked == true } value='option1' onChange={this.handleChange}/>
          <span>Yes</span>
          <input type="radio" name={identifier} checked={isChecked == false } value='option2' onChange={this.handleChange}/>
          <span>No</span>
        </div>
      </div>
    );
  }
}

export default InputRadio;
