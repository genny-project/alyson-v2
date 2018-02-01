import './gennyHeader.scss';
import { customStyle } from './gennyHeaderStyle';
import React, { Component } from 'react';
import { Label, Dropdown, ImageView, IconSmall, GennyTreeView, GennyNotification, ColorPicker, Device, Header, Selector } from 'views/components';
import { Grid } from '@genny-project/layson';
import { string,object, bool  } from 'prop-types';
import store from 'views/store';
import { GennyBridge, BaseEntityQuery } from 'utils/genny';
import decode_token from 'jwt-decode';

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

    const { style, className, projectTitle, projectGreeting, userName, userImage, hideSubheader, token, currentUser } = this.props;
    const componentStyle = {
      ...style,
      ...customStyle.gennyHeader
    };

    if(currentUser) {
      const isOwner = BaseEntityQuery.getBaseEntityAttribute(currentUser, 'PRI_OWNER' );
      const isDriver = BaseEntityQuery.getBaseEntityAttribute(currentUser, 'PRI_DRIVER' );
      console.log(isOwner, isDriver);
    }
    
    let session_data = decode_token(token);
    let roles = session_data.realm_access.roles;

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
          rows={[ { style: { flexGrow: "1", paddingLeft: `${ window.getScreenSize() == 'sm' ? '50px' : '10px' }`, height: "100%" } } ]}
        >
          <h3 position={[0,0]} style={{margin: '0'}}>{projectTitle}</h3 >
          <ImageView position={[0,1]} src={userImage} style={{ padding: '5px', width: '40px', minWidth: '40px'}}/>
          <Label position={[0,1]} text={`${userName}`} />
          <Dropdown
            style={ customStyle.dropdown }
            position={[0,1]}
            header={
              <span style={ customStyle.dropdownSpan }><IconSmall name="arrow_drop_down" /></span>
            }
          >
            <ul className="dropdown-profile" style={ customStyle.dropdownProfile }>
              <li style={ customStyle.dropdownLi } onClick={this.handleProfile}><IconSmall name="person" /><span>Profile</span></li>
              <li style={ customStyle.dropdownLi } onClick={this.handleAccount}><IconSmall name="settings" /><span>Account</span></li>
              <Selector checkValues={roles} showValues={['admin']}>
                <li style={ customStyle.dropdownLi } onClick={this.handleMessages}><IconSmall name="email" /><span>Test Message</span></li>
              </Selector>
              <br/>
              <li style={ customStyle.dropdownLi } onClick={this.handleLogout}><IconSmall name="power_settings_new" /><span>Log Out</span></li>
            </ul>
          </Dropdown>
        </Header>
        { !hideSubheader ?
        <Grid className='sub-header' cols={[1]} rows={1} style={ customStyle.subHeader }>
          <GennyTreeView isHorizontal={true} style={{ backgroundColor: '#333' }} position={[0,0]}/>
        </Grid> : null }
      </div>
    );
  }
}

export default GennyHeader;
