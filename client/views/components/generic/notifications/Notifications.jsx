import './notifications.scss';
import React, { Component } from 'react';
import { string, int } from 'prop-types';
import { IconSmall, Dropdown } from '../';

class Notifications extends Component {

  static defaultProps = {
    className: '',
    notificationCount: 0
  }

  static propTypes = {
    className: string,
    notificationCount: int
  }

  state = {
    isVisible: false
  }

  handleClickNotifs = () => {
    this.setState(prevState => ({
      isVisible: !prevState.isVisible
    }));
  }

  render() {
    const { className, notificationCount } = this.props;
    const { isVisible } = this.state;

    return (
      <div className="notifications" onClick={this.handleClickNotifs}>
        <IconSmall name="forum"/>
        <div className="number" ><span>{notificationCount}</span></div>
        <Dropdown visible={isVisible}>
          <ul className="notifications-dropdown">
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </Dropdown>
      </div>
    )
  }
}

export default Notifications;
