import './ContactButton.scss';
import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { IconSmall } from 'views/components';

class ContactButton extends Component {

  static defaultProps = {
    link: '',
    icon: 'phone',
    type: 'tel',
    className: ''
  }

  static propTypes = {
    link: string,
    style: object,
    className: string,
    icon: string,
    type: string
  }

  render() {

    const { link, style, className, icon, type  } = this.props;
    const componentStyle = { ...style };

    if(!link) return null;

    return (
      <a className={`contact-button ${className}`} href={`${type}:${link}`} style={componentStyle}>
          <IconSmall className='contact-button-icon' name={icon} />
      </a>
    );
  }
}

export default ContactButton;
