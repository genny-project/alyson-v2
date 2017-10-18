import './gennyNotification.scss';
import React, { Component } from 'react';
import { Notifications } from '../../../components';
import { string, any, array } from 'prop-types';

class GennyNotification extends Component {

    static defaultProps = {
      notifications: []
    };

    static propTypes = {
      notifications: array
    };

  state = {
  }

  render() {

    const { notifications } = this.props;

    return (
      <Notifications notificationCount={notifications.length}>
      </Notifications>
    );
  }
}

export default GennyNotification;
