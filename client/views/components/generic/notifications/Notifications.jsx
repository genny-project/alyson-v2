import './notifications.scss';
import React, { Component } from 'react';
import { string, int, object } from 'prop-types';
import { IconSmall, Dropdown, NotificationItem } from '../';
import Input from '../input';
import { GennyForm } from '../../genny';
class Notifications extends Component {

  static defaultProps = {
    className: '',
    notifications:{}
  }

  static propTypes = {
    className: string,
    notifications: object
  }

  state = {
  }

  getDropdownHeader = () => {
    const {notifications} = this.props;
    return (
      <div>
        <IconSmall name="forum"/>
        <div className="number" ><span>{Object.keys(notifications).length}</span></div>
      </div>
    );
  }

  render() {

    const { className, notifications } = this.props;

    const dropdownHeader = this.getDropdownHeader();
    return <div className="notifications" onClick={this.handleClickNotifs}>
        <Dropdown header={dropdownHeader} className="notification-area">
          <ul className="notifications-dropdown">
            {Object.keys(notifications).map((notification_key, index) => {
              return <NotificationItem notification={notifications[notification_key]} />;
            })}
          </ul>
          <GennyForm name="Hello"/>
        </Dropdown>
      </div>;
  }
}

export default Notifications;
