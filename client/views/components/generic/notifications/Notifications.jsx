import './notifications.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';
import { IconSmall } from '../';

class Notifications extends Component {
  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
  }

  render() {
    const { className } = this.props;
    return (
      <div className="notifications" >
        <IconSmall name="forum"/>
        <div className="number" ><span>2</span></div>
      </div>
    )
  }
}

export default Notifications;
