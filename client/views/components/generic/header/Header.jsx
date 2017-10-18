import './header.scss';
import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { IconSmall, Profile, Label, ImageView, Dropdown } from '../';
import { GennyNotification } from '../../genny';
import { GennyBridge } from 'utils/genny';

class Header extends Component {
  static defaultProps = {
    className: '',
    style: {},
  }

  static propTypes = {
    className: string,
    style: object,
  }

  state = {
    isVisible: false
  }

  handleClickProfile = () => {
    this.setState(prevState => ({
      isVisible: !prevState.isVisible
    }));
  }

  handleLogout = () => {
    this.sendData('LOGOUT', {
      code: 'LOGOUT',
    });
  }

  handleAccount = () => {
    this.sendData('ACCOUNTS', {
      code: 'ACCOUNTS',
    });
  }

  handleClickImage = () => {
    //console.log("clicked profile image");
  }

  sendData(event, data) {
    console.log('send', data);
    GennyBridge.sendLogout(event, data);
  }

  render() {
    const { className, projectTitle, userName, userImage, style } = this.props;
    const { isVisible } = this.state;

    const componentStyle = {
      ...style,
    };

    return (
      <div className="header" style={componentStyle}>
        <div className="header-left">
          <Label text={projectTitle} />
        </div>
        <div className="header-right">
          <GennyNotification />
          <div className="profile">
            <Label text={`Welcome, ${userName}`} onClick={this.handleClickProfile} />
            <ImageView src={userImage} onClick={this.handleClickImage} />

            <Dropdown visible={isVisible}>
                <ul className="profile-dropdown">
                  <li><IconSmall name="person" /><span>Profile</span></li>
                  <li onClick={this.handleAccount} ><IconSmall name="settings" /><span>Account</span></li>
                  <li onClick={this.handleLogout} ><IconSmall name="power_settings_new" /><span>Sign Out</span></li>
                </ul>
            </Dropdown>

          </div>
          <IconSmall className="help" name="help" />
        </div>
      </div>
    );
  }
}

export default Header;
