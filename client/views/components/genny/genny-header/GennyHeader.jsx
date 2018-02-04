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
    isOpen: false
  }

  handleClick = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  }

  handleBlur = () => {
    this.setState({
      isOpen: false
    });
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
    this.setState({
      isOpen: false
    });
  }

  handleProfile = () => {
    this.sendData('PROFILE', {
      code: 'PROFILE',
    });
    this.setState({
      isOpen: false
    });
  }

  handleMessages = () => {
    this.sendData('TV_SELECT', {
      code: 'TV1',
      value: 'GRP_COMMS_TEST'
    }, 'GRP_COMMS_TEST');
    this.setState({
      isOpen: false
    });
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
    const { isOpen } = this.state;
    const componentStyle = {
      ...style,
      ...customStyle.gennyHeader
    };

    let isOwner = currentUser && BaseEntityQuery.getBaseEntityAttribute(currentUser, 'PRI_OWNER' );
    isOwner = isOwner && isOwner.value;
    let isDriver = currentUser && BaseEntityQuery.getBaseEntityAttribute(currentUser, 'PRI_DRIVER' );
    isDriver = isDriver && isDriver.value;

    let session_data = decode_token(token);
    let roles = session_data.realm_access.roles;

    return (
      <div className={`genny-header ${window.getScreenSize()}`} style={componentStyle}>
        <Header
          className='main-header'
          cols={[
            { style: {
              flexGrow: '1',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '5px',
              paddingRight: '5px'
            }},
            { style: {
              flexGrow: '1',
              justifyContent: 'flex-end',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '5px',
              paddingRight: '5px'
            }}
          ]}
          rows={[ { style: { flexGrow: '1', paddingLeft: `${ window.getScreenSize() == 'sm' ? '50px' : '10px' }`, height: '100%' } } ]}
        >
          <h3 position={[0,0]} style={{margin: '0'}}>{projectTitle}</h3 >
          <Label
            position={[0,1]}
            text={`${isOwner ? 'OWNER' : ''} ${isDriver ? 'DRIVER' : ''}`}
            style={{
              marginRight: '5px',
              fontSize: '0.75em',
              border: 'solid 1px #BBB',
              borderRadius: '5px',
              padding: '2.5px 5px'
            }}
          />
          <ImageView position={[0,1]} src={userImage} style={{ padding: '5px', width: '40px', minWidth: '40px'}}/>
          <Label position={[0,1]} text={`${userName}`} />
          <Dropdown
            style={ customStyle.dropdown }
            position={[0,1]}
            open={isOpen}
            onBlur={this.handleBlur}
            tabIndex='-1'
            header={
              <span style={ customStyle.dropdownSpan }>
                <IconSmall
                  name="arrow_drop_down"
                  onClick={this.handleClick}
                />
              </span>
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
