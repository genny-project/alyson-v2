import './gennyHeader.scss';
import React, { Component } from 'react';
import { Label, Dropdown, ImageView, IconSmall, GennyTreeView, GennyNotification, ColorPicker, } from '../../';
import { Grid } from '@genny-project/layson';
import { string,object  } from 'prop-types';
import store from 'views/store';
import { GennyBridge } from 'utils/genny';

class GennyHeader extends Component {

  static defaultProps = {
    className: '',
    style: {},
  }

  static propTypes = {
    className: string,
    height: string,
    style: object
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
        attributeCode: "PRI_COLOR",
        value: color
      }
    ];
    GennyBridge.sendAnswer(answer);
  };

  render() {

    const { style, screenSize, className, projectTitle, projectGreeting, userName, userImage } = this.props;
    const {  } = this.state;
    const componentStyle = {
      ...style,
    };

    return (
      <div className={`genny-header ${screenSize}`} style={componentStyle}>
        <div style={{height: '50px'}}>
          <Grid className='main-header' cols={[15,1,1,4,1,1]} rows={1}>
            <Label text={projectTitle} position={[0,0]} />
            <ColorPicker {...this.props}
              onColorChange={ this.onColorChange }
              position={[0,1]}/>
            <GennyNotification position={[0,2]} />
            <Dropdown position={[0,3]} header={
              <span style={{display: 'flex', alignItems: 'center'}}><Label text={`${projectGreeting}, ${userName}`} /><IconSmall name="expand_more" /></span>}
            >
              <ul className="dropdown-profile" >
                <li onClick={this.handleProfile}><IconSmall name="person" /><span>Profile</span></li>
                <li onClick={this.handleAccount} ><IconSmall name="settings" /><span>Account</span></li>
                <li onClick={this.handleLogout} ><IconSmall name="power_settings_new" /><span>Log Out</span></li>
              </ul>
            </Dropdown>
            <ImageView src={userImage} onClick={this.handleClickImage} position={[0,4]} style={{ width: '40px'}}/>
            <IconSmall className="help" name="help" position={[0,5]}/>
          </Grid>
        </div>
        <Grid className='sub-header' cols={[1]} rows={1}>
          <GennyTreeView isHorizontal={true} style={{ backgroundColor: componentStyle.backgroundColor }} position={[0,0]}/>
        </Grid>

      </div>
    );
  }
}

export default GennyHeader;
