import './gennyHeader.scss';
import React, { Component } from 'react';
import { Header, GennyTreeView, GennyNotification, ColorPicker, } from '../../';
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
    console.log('hello')
    let answer = [
      {
        targetCode: this.props.currentProject,
        attributeCode: "PRI_COLOR",
        value: color
      }
    ];
    GennyBridge.sendAnswer(answer);
  };

  handleMouseOver = (color) => {
    this.setState({
      hoverColor: color,
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
          handleLogout={this.handleLogout}>

          <GennyNotification />

          <ColorPicker {...this.props}
            hoverColor={hoverColor}
            handleChangeComplete={ this.handleChangeComplete }
            handleMouseOver={ this.handleMouseOver}
            handleMouseOut={this.handleMouseOut}/>

        </Header>
        <GennyTreeView isHorizontal={true} style={{ backgroundColor: componentStyle.backgroundColor }}/>
      </div>
    );
  }
}

export default GennyHeader;
