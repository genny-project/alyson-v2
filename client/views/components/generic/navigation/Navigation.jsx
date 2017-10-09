import './navigation.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';
import { IconSmall, Profile, Notifications } from '../';

class Navigation extends Component {
  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
  }

  render() {
    const { className } = this.props;
    return (
      <div className="navigation">
        <Notifications />
        <Profile />
        <div className="help">
          <IconSmall name="help"/>
        </div>
      </div>
    )
  }
}

export default Navigation;
