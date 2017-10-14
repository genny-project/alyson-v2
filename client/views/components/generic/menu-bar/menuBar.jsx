import './menuBar.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';
import { IconSmall, Profile, Notifications, Label, ImageView } from '../';

import store from 'views/store';
import { GennyBridge } from 'utils/genny';

class MenuBar extends Component {
  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
  }

  state = {
    isVisible: false
  } 

  handleProfileEnter = () => {
    this.setState({
        isVisible: true,
    });
  }

  handleProfileLeave = () => {
    this.setState({
        isVisible: false,
    });
  }

  handleLogout = () => {
    this.sendData('LOGOUT', {
      code: 'LOGOUT',
    });
  }

  handleAccount = () => {
    
  }

  handleProfileImage = () => {
    //console.log("clicked profile image");
  }

  sendData(event, data) {
    console.log('send', data);
    const token = store.getState().keycloak.token;
    GennyBridge.sendLogout(event, data, token);
  }

  render() {
    const { className } = this.props;
    const { isVisible } = this.state;

    return (
      <div className="menu-bar">
        <div className="menu-bar-left">
          <Label text="Project Title" />
          <ImageView src="https://lh3.googleusercontent.com/6EmDogbGliWNJdXB8NUX4oBxCx3TWZtQpsGdsC63miS1Ia4MrBsXC23GFta5AkC0yBE=w300" />
        </div>
        <div className="menu-bar-right">
          <Notifications />
          <div className="profile" onMouseEnter={this.handleProfileEnter} onMouseLeave={this.handleProfileLeave}>
            <Label text="Welcome, Name" />
            <ImageView src="http://www.terry.uga.edu/digitalmarketing/images/icons/user.jpg" onClick={this.handleProfileImage} />
            { isVisible ?
                <ul className="navigation-dropdown">
                  <li><IconSmall name="person" /><span>Profile</span></li>
                  <li onClick={this.handleAccount} ><IconSmall name="settings" /><span>Account</span></li>
                  <li onClick={this.handleLogout} ><IconSmall name="power_settings_new" /><span>Sign Out</span></li>
                </ul>
            : null } 
          </div>
          <IconSmall className="help" name="help" />
        </div>
      </div>
    );
  }
}

export default MenuBar;
