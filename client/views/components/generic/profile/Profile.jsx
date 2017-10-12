import './profile.scss';
import React, { Component } from 'react';
import { IconSmall, Imageview } from '../';
import { string } from 'prop-types';
import store from 'views/store';
import { GennyBridge } from 'utils/genny';


class Profile extends Component {

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

  sendData(event, data) {
    console.log('send', data);
    const token = store.getState().keycloak.token;
    GennyBridge.sendLogout(event, data, token);
  }

  render() {
 	  const { className,  } = this.props;
    const { isVisible } = this.state;
    
    return (
      <div className="profile">
        <div className="profile-main" onMouseEnter={this.handleProfileEnter} onMouseLeave={this.handleProfileLeave}>
          <span>Welcome, FirstName</span>
          {/* const src = if profileimage is true then profileimage, else default image. 
          <Imageview src={src} /> */}
          <IconSmall className="profile-image" name="person"/>
          { isVisible ? 
            <ul className="dropdown">
              <li><IconSmall name="person" /><span>Profile</span></li>
              <li><IconSmall name="settings" /><span>Settings</span></li>
              <li onClick={this.handleLogout} ><IconSmall name="power_settings_new" /><span>Sign Out</span></li>
            </ul> 
          : null } 
        </div>     
      </div>
    );
  }
}

export default Profile;
