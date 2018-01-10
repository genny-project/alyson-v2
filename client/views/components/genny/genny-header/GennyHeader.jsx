import './gennyHeader.scss';
import { customStyle } from './gennyHeaderStyle';
import React, { Component } from 'react';
import { Label, Dropdown, ImageView, IconSmall, GennyTreeView, GennyNotification, ColorPicker, Device, Header } from 'views/components';
import { Grid } from '@genny-project/layson';
import { string,object, bool  } from 'prop-types';
import store from 'views/store';
import { GennyBridge } from 'utils/genny';

class GennyHeader extends Component {

  static defaultProps = {
    className: '',
    style: {},
    hideSubheader: false
  }

  static propTypes = {
    className: string,
    height: string,
    style: object,
    hideSubheader: bool
  };

  state = {
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

  handleProfile = () => {
    this.sendData('PROFILE', {
      code: 'PROFILE',
    });
  }

  handleMessages = () => {
    this.sendData('TV_SELECT', {
      code: 'TV1',
      value: 'GRP_COMMS_TEST'
  }, 'GRP_COMMS_TEST');
  }

  sendEvent(event, data) {
    GennyBridge.sendTVEvent(event, data);
  }

  handleClickImage = () => {
    //console.log("clicked profile image");
  }

  sendData(event, data) {
    GennyBridge.sendLogout(event, data);
  }

  onColorChange = (color) => {
    let answer = [
      {
        targetCode: this.props.currentProject,
        attributeCode: 'PRI_COLOR',
        value: color
      }
    ];
    GennyBridge.sendAnswer(answer);
  };

  render() {

    const { style, className, projectTitle, projectGreeting, userName, userImage, hideSubheader } = this.props;
    const { } = this.state;
    const componentStyle = {
      ...style,
      ...customStyle.gennyHeader
    };

    return (
      <div className={`genny-header ${window.getScreenSize()}`} style={componentStyle}>
        <Header
          className='main-header'
          cols={[
            { style: { 
              flexGrow: "1", 
              color: "white",
              display: "flex",
              alignItems: "center",
              paddingLeft: "5px",
              paddingRight: "5px" 
            }},
            { style: { 
              flexGrow: "1", 
              justifyContent: "flex-end", 
              color: "white",
              display: "flex",
              alignItems: "center",
              paddingLeft: "5px",
              paddingRight: "5px" 
            }}
          ]} 
          rows={[ { style: { flexGrow: "1", paddingLeft: "50px", height: "100%" } } ]}
        >
          <Label text={projectTitle} position={[0,0]} />
          {/*<GennyNotification position={[0,1]} />*/}
          
          <Dropdown 
            style={ customStyle.dropdown } 
            position={[0,1]}
            header={
              <span style={ customStyle.dropdownSpan }><Label text={`${userName}`} /><IconSmall name="expand_more" /></span>}
            >
              <ul className="dropdown-profile" style={ customStyle.dropdownProfile }>
                <li style={ customStyle.dropdownLi } onClick={this.handleProfile}><IconSmall name="person" /><span>Profile</span></li>
                <li style={ customStyle.dropdownLi } onClick={this.handleAccount}><IconSmall name="settings" /><span>Account</span></li>
                <li style={ customStyle.dropdownLi } onClick={this.handleMessages}><IconSmall name="person" /><span>Text Message</span></li>
                <br/>
                <li style={ customStyle.dropdownLi } onClick={this.handleLogout}><IconSmall name="power_settings_new" /><span>Log Out</span></li>
              </ul>
          </Dropdown>
          
          {/*}
          <Device isDesktop position={[0,1]}>
            <ImageView src={userImage} onClick={this.handleClickImage} style={{ width: '40px', minWidth: '40px'}}/>
          </Device>
          <Device isDesktop position={[0,1]}>
            <IconSmall className="help" name="help"/>
            </Device>*/}
        </Header>
        { !hideSubheader ? 
        <Grid className='sub-header' cols={[1]} rows={1} style={ customStyle.subHeader }>
          <GennyTreeView isHorizontal={true} style={{ backgroundColor: componentStyle.backgroundColor }} position={[0,0]}/>
        </Grid> : null }
      </div>
    );
  }
}

export default GennyHeader;
