import './SMSButton.scss';
import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { IconSmall } from 'views/components';

class SMSButton extends Component {

  static defaultProps = {
    phoneNumber: '',
  }

  static propTypes = {
    phoneNumber: string,
    style: object,
    className: string,
  }

  render() {

    const { phoneNumber, style, className  } = this.props;
    const componentStyle = { ...style };

    if(!phoneNumber) return null;

    return (
      <a className={`sms-button ${className}`} href={`tel:${phoneNumber}`} style={componentStyle}>
          <IconSmall name='message' />
      </a>
    );
  }
}

export default SMSButton;
