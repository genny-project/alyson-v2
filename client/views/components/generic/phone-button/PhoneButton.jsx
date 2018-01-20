import './PhoneButton.scss';
import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { IconSmall } from 'views/components';

class PhoneButton extends Component {

  static defaultProps = {
    phoneNumber: '',
  }

  static propTypes = {
    phoneNumber: string,
    style: object,
    className: string,
  }

  render() {

    const { phoneNumber, style, className } = this.props;
    const componentStyle = { ...style};

    if(!phoneNumber) return null;

    return (
      <a className={`phone-button ${className}` } href={`tel:${phoneNumber}`} style={componentStyle}>
          <IconSmall name='phone' />
      </a>
    );
  }
}

export default PhoneButton;
