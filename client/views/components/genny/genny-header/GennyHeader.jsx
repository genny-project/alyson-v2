import './gennyHeader.scss';
import React, { Component } from 'react';
import { Header, GennyTreeView, GennyNotification, CircleButton, Dropdown } from '../../';
import { string,object  } from 'prop-types';
import store from 'views/store';
import { GennyBridge } from 'utils/genny';
import { TwitterPicker as ColorPicker } from 'react-color';

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
    hoverColor: null,
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
    let answer = [
      {
        targetCode: this.props.currentProject,
        attributeCode: "PRI_COLOR",
        value: color.hex
      }
    ];

    GennyBridge.sendAnswer(answer);
  };

  handleMouseOver = (color) => {
    this.setState({
      hoverColor: color.hex,
    });
  }

  handleMouseOut = () => {
    this.setState({
      hoverColor: null,
    });
  }

  render() {

    const { style, height, screenSize } = this.props;
    const { hoverColor } = this.state;
    
    const componentStyle = {
      ...style, height: height
    };

    return (
      <div className={`genny-header ${screenSize}`} style={componentStyle}>
        <Header
          {...this.props}
          handleAccount={this.handleAccount}
          handleLogout={this.handleLogout}
        >
          <GennyNotification />
          <Dropdown noDropdownStyle header={
            <CircleButton primaryColor={hoverColor ? hoverColor : componentStyle.backgroundColor} />}
          >
            <ColorPicker
                color={componentStyle.backgroundColor}
                onChangeComplete={ this.handleChangeComplete }
                onSwatchHover={ this.handleMouseOver}
                onMouseOut={this.handleMouseOut}/>
          </Dropdown>
        </Header>
        <GennyTreeView isHorizontal={true} style={{ backgroundColor: componentStyle.backgroundColor }}/>
      </div>
    );
  }
}

export default GennyHeader;
