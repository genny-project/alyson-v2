import './gennyHeader.scss';
import React, { Component } from 'react';
import { Label, Dropdown, ImageView, IconSmall, GennyTreeView, GennyNotification, ColorPicker, Device } from 'views/components';
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
    };

    return (
      <div className={`genny-header ${window.getScreenSize()}`} style={componentStyle}>
        <Grid className='main-header' cols={[1,1]} rows={1}>
          <Label text={projectTitle} position={[0,0]} />
          {/*<GennyNotification position={[0,1]} />*/}
          <Device isDesktop position={[0,1]}>
            <Dropdown 
              style={{ marginRight: '30px'}} 
              header={
                <span style={{display: 'flex', alignItems: 'center'}}><Label text={`${userName}`} /><IconSmall name="expand_more" /></span>}
              >
                <ul className="dropdown-profile" >
                  <li onClick={this.handleProfile}><IconSmall name="person" /><span>Profile</span></li>
                  <li onClick={this.handleAccount} ><IconSmall name="settings" /><span>Account</span></li>
                  <li onClick={this.handleLogout} ><IconSmall name="power_settings_new" /><span>Log Out</span></li>
                </ul>
            </Dropdown>
          </Device>
          {/*}
          <Device isDesktop position={[0,1]}>
            <ImageView src={userImage} onClick={this.handleClickImage} style={{ width: '40px', minWidth: '40px'}}/>
          </Device>
          <Device isDesktop position={[0,1]}>
            <IconSmall className="help" name="help"/>
            </Device>*/}
        </Grid>
        { !hideSubheader ? 
        <Grid className='sub-header' cols={[1]} rows={1}>
          <GennyTreeView isHorizontal={true} style={{ backgroundColor: componentStyle.backgroundColor }} position={[0,0]}/>
        </Grid> : null }
      </div>
    );
  }
}

export default GennyHeader;
