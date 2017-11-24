import './header.scss';
import React, { Component } from 'react';
import { string, object, any, func } from 'prop-types';
import { IconSmall, Profile, Label, ImageView, Dropdown,  } from '../../';
import { GennyBridge } from 'utils/genny';

class Header extends Component {
  static defaultProps = {
    className: '',
    style: {},
  }

  static propTypes = {
    className: string,
    style: object,
    children: any,

  }

  state = {
  }

  handleAccount = () => {
    this.props.handleAccount();
  }

  handleLogout = () => {
  this.props.handleLogout();
  }

  render() {

    const { className, projectTitle, userName, userImage, style, children } = this.props;
    const {  } = this.state;

    const componentStyle = {
      ...style,
    };

    return (

      <div className={`header`} style={componentStyle}>
        <div className="header-container">
            <div className="header-left">
              <Label text={projectTitle} />
            </div>

            { children ?
              <div className="header-center">
                {children}
              </div>
            : null }

            <div className="header-right">
              <Dropdown header={
                <Label text={`Welcome, ${userName}`} />}
              >
                <ul className="dropdown-profile" >
                  <li><IconSmall name="person" /><span>Profile</span></li>
                  <li onClick={this.handleAccount} ><IconSmall name="settings" /><span>Account</span></li>
                  <li onClick={this.handleLogout} ><IconSmall name="power_settings_new" /><span>Sign Out</span></li>
                </ul>
              </Dropdown>
              <ImageView src={userImage} onClick={this.handleClickImage} />

              <IconSmall className="help" name="help" />
            </div>
        </div>

      </div>
    );
  }
}

export default Header;
