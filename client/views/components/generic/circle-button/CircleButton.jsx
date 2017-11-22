import './circleButton.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import {  } from '../';

class CircleButton extends Component {

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
      <div className={`circleButton`} style={style} {...this.props}>

      </div>
    );
  }
}

export default CircleButton;
