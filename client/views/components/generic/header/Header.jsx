import './header.scss';
import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { IconSmall, Profile, Label, ImageView, Dropdown, CircleButton, Breadcrumbs } from '../';
import { GennyNotification } from '../../genny';
import { GennyBridge } from 'utils/genny';
import { GithubPicker as ColorPicker } from 'react-color';

class Header extends Component {
  static defaultProps = {
    className: '',
    style: {},
  }

  static propTypes = {
    className: string,
    style: object,
    height: string,
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
    GennyBridge.sendLogout(event, data);
  }

  handleChangeComplete = (color) => {

      console.error("Changing color answer has to be changed");
      let answer = [
          {
              sourceCode: "PER_USER1",
              targetCode: "PRJ_CHANNEL40",
              attributeCode: "PRI_COLOR",
              value: color.hex
          }
      ];

      GennyBridge.sendAnswer('Answer', answer);
      this.toggleColorPicker();
  };

  toggleColorPicker = () => {

      this.setState({
          displayColorPicker: !this.state.displayColorPicker
      });
  }

  render() {

    const { className, projectTitle, userName, userImage, style, height } = this.props;
    const { isVisible } = this.state;

    const componentStyle = {
      ...style, height: height
    };

    const popover = {
        position: 'absolute',
        zIndex: '2',
        top: "50px",
        right: "10px"
    };
    const cover = {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
    };
    return (

      <div className="header" style={componentStyle}>
        <div className="header-container">
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
              <CircleButton primaryColor={componentStyle.backgroundColor} onClick={ this.toggleColorPicker } />
              {
                  this.state.displayColorPicker ?
                  <div style={ popover } >
                      <div style={ cover } onClick={ this.toggleColorPicker }> </div>
                      <ColorPicker
                          color={componentStyle.backgroundColor}
                          onChangeComplete={ this.handleChangeComplete } />
                  </div>
                  : null
              }
            </div>
        </div>
        <Breadcrumbs path={"test/test/"} style={{ backgroundColor: componentStyle.backgroundColor }}/>
      </div>
    );
  }
}

export default Header;
