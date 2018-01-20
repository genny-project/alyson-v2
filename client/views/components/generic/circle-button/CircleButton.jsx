import './circleButton.scss';
import React, { Component } from 'react';
import { string, func } from 'prop-types';

class CircleButton extends Component {

  static propTypes = {
    onClick: func,
    primaryColor: string,
  };

  render() {
    const { primaryColor } = this.props;

    const style = {
        backgroundColor: primaryColor,
        border: '3px solid #fff',
        width: '35px',
        height: '35px',
        borderRadius: '17.5px',
        marginLeft: '10px'
    };

    return (
      <div className={'circleButton'} style={style} onClick={this.props.onClick}/>
    );
  }
}

export default CircleButton;
