import './inputSocial.scss';
import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { InputDate, SocialButton, InputSlider, InputDatePicker, InputDropdown, InputTime, InputText, InputTextarea, InputCheckbox, InputAddress, InputUploadPhoto } from '../';

//TODO: to remove
import { GennySocialButton } from './../../';

class Input extends Component {
    
  static defaultProps = {
    className: '',
    type: ''
  }

  static propTypes = {
    className: string,
    type: string,
  }

  state = {

  }

  render() {

      const { className, style, name, optional, readOnly, placeholder, validationStatus, isHorizontal } = this.props;
      const componentStyle = { ...style, };
      const { date, focused } = this.state;

      return (
        <div className={`input-social`}>
            <SocialButton {...this.props}/>
        </div>
      );
  }
}

export default Input;
