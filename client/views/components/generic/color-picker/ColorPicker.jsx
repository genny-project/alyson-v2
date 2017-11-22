import './colorPicker.scss';
import React, { Component } from 'react';
import { } from 'prop-types';
import { CircleButton, } from '../';
import { TwitterPicker as ReactColor } from 'react-color';

class ColorPicker extends Component {

  static propTypes = {
  };

  state = {
      showColorPicker: false,
  }

  handleChangeComplete = (color) => {
    console.log('handle', color);
    this.props.handleChangeComplete(color.hex);
  }

  handleMouseOver = (color) => {
    this.props.handleMouseOver(color.hex);
  }

  handleMouseOut = () => {
    this.props.handleMouseOut(null);
  }

  toggleColorPicker = () => {
      this.setState({
          showColorPicker: !this.state.showColorPicker
      })
  }

  render() {

    const { primaryColor, hoverColor, style } = this.props;
    const { showColorPicker } = this.state;

    return (
      <div className='color-picker'>
        <CircleButton onClick={this.toggleColorPicker}>
          {
              showColorPicker ?
              <ReactColor
                color={componentStyle.backgroundColor}
                onChangeComplete={ this.handleChangeComplete }
                onSwatchHover={ this.handleMouseOver}
                onMouseOut={this.handleMouseOut}/> : null
          }
        </CircleButton>
      </div>
    );
  }
}

export default ColorPicker;
