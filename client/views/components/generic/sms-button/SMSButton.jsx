import './SMSButton.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';

class SMSButton extends Component {

  static defaultProps = {
    phoneNumber: '',
  }

  static propTypes = {
    phoneNumber: string
  }

  render() {

    const { phoneNumber, className  } = this.props;
    const componentStyle = {  };

    return (
      <a className={`sms-button ${className}`} href={`tel:${phoneNumber}`}>{phoneNumber}</a>
    );
  }
}

export default SMSButton;
