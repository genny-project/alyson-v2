import './notifications.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';
import { IconSmall, Dropdown } from '../';

class Notifications extends Component {
  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
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
    const { className } = this.props;
    const { isVisible } = this.state;

    return (
      <div className="notifications" onClick={this.handleClickNotifs}>
        <IconSmall name="forum"/>
        <div className="number" ><span>2</span></div>
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
