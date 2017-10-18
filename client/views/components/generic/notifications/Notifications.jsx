import './notifications.scss';
import React, { Component } from 'react';
import { string, int, object } from 'prop-types';
import { IconSmall, Dropdown, NotificationItem } from '../';

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
    isVisible: false
  }

  handleClickNotifs = () => {
    this.setState(prevState => ({
      isVisible: !prevState.isVisible
    }));
  }

  render() {

    const { className, notifications } = this.props;
    const { isVisible } = this.state;

    console.log(notifications);
    return (
      <div className="notifications" onClick={this.handleClickNotifs}>
        <IconSmall name="forum"/>
        <div className="number" ><span>{Object.keys(notifications).length}</span></div>
        <Dropdown visible={isVisible}>
          <ul className="notifications-dropdown">
      	        {
                    Object.keys(notifications).map((notification_key, index) => {
                        return <NotificationItem notification={notifications[notification_key]} />
                    })
      	        }
          </ul>
        </Dropdown>
      </div>
    )
  }
}

export default Notifications;
