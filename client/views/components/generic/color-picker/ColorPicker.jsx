import './colorPicker.scss';
import React, { Component } from 'react';
import { string, func, object } from 'prop-types';
import { CircleButton } from 'views/components';
import { TwitterPicker as ReactColor } from 'react-color';

class ColorPicker extends Component {

  static propTypes = {
      primaryColor: string,
      onColorChange: func,
      style: object,
  };

  state = {
      showColorPicker: false,
  }

  onColorChange = (color) => {
    if(this.props.onColorChange) {
        this.props.onColorChange(color.hex);
    }
  }

  toggleColorPicker = () => {
    this.setState({
        showColorPicker: !this.state.showColorPicker
      });
  }

  render() {
    const { style } = this.props;
    const { showColorPicker } = this.state;

    return (
      <div className='color-picker'>
        <CircleButton onClick={this.toggleColorPicker}/>
        {
            showColorPicker ?
            <div className="color-picker-selector">
                <ReactColor
                  color={style.backgroundColor}
                  onChangeComplete={ this.onColorChange }/>
            </div> : null
          }
      </div>
    );
  }
}

export default ColorPicker;
