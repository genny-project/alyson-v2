import './SMSButton.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import { IconSmall } from 'views/components';

class SMSButton extends Component {

  static defaultProps = {
    phoneNumber: '',
  }

  static propTypes = {
    phoneNumber: string
  }

  render() {

    const { phoneNumber  } = this.props;
    const componentStyle = {  };

    if(!phoneNumber) return null;

    return (
      <a className={`sms-button`} href={`tel:${phoneNumber}`} >
          <IconSmall name={"message"} />
      </a>
    );
  }
}

export default SMSButton;
