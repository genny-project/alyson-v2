import './gennyNotification.scss';
import React, { Component } from 'react';
import { Notifications } from '../../../components';
import { string, any, object } from 'prop-types';

class GennyNotification extends Component {

    static defaultProps = {
      notifications: {}
    };

    static propTypes = {
      notifications: object
    };

  state = {
  }

  render() {

    const { notifications } = this.props;

    return <Notifications notifications={notifications}>
      </Notifications>;
  }
}

export default GennyNotification;
