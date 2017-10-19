import './notificationItem.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import {  } from '../';

class NotificationItem extends Component {

  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
    style: string,
    notification: object,
  }

  state = {
  }

  render() {

    const { className, style, notification } = this.props;
    const componentStyle = { ...style, };

    return (
      <li className={`notification-item ${className}`}>
          <p>{notification.title}</p>
          <p>{notification.description}</p>
      </li>
    );
  }
}

export default NotificationItem;
