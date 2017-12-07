import './colorPicker.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';
import { CircleButton, } from '../';
import { TwitterPicker as ReactColor } from 'react-color';

class ColorPicker extends Component {

  static propTypes = {
      primaryColor: string,
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

    const { primaryColor, hoverColor, style } = this.props;
    const { showColorPicker } = this.state;

    //console.log(showColorPicker);

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
