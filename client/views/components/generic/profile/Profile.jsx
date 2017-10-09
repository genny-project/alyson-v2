import './profile.scss';
import React, { Component } from 'react';
import { IconSmall, Imageview } from '../';
import { string } from 'prop-types';

class Profile extends Component {

  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
  }

  state = {
  } 

  render() {
 	  const { className,  } = this.props;
    const {  } = this.state;
    
    return (
      <div className="profile">
        <span>Welcome, FirstName</span>
        //const src = if profileimage is true then profileimage, else default image. 
        //<Imageview src={src} />
        <div><IconSmall name="person"/></div>
        <div>
          <ul>
            <li><IconSmall name="person"/><span>Profile</span></li>
            <li><IconSmall name="settings"/><span>Settings</span></li>
            <li><IconSmall name="power_settings_new"/><span>Sign Out</span></li>
          </ul> 
        </div>
      </div>
    );
  }
}

export default Profile;
