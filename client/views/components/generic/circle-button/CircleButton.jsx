import './circleButton.scss';
import React, { Component } from 'react';
import { string, object, any, func } from 'prop-types';
import {  } from '../';

class CircleButton extends Component {

  static propTypes = {
    onClick: func,
  };

  state = {
  }

  render() {

    const { primaryColor } = this.props;

    const style = {
        backgroundColor: primaryColor,
        border: "3px solid #fff",
        width: "35px",
        height: "35px",
        borderRadius: "17.5px",
        marginLeft: "10px"
    }

    return (
      <div className={`circleButton`} style={style} onClick={this.props.onClick}/>
    );
  }
}

export default CircleButton;
