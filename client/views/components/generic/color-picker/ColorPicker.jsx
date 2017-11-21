import './colorPicker.scss';
import React, { Component } from 'react';
import { } from 'prop-types';
import { Dropdown, } from '../';
import { TwitterPicker as ReactColor } from 'react-color';

class ColorPicker extends Component {

  static propTypes = {   
  };

  state = {
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

  render() {

    const { primaryColor, hoverColor, style } = this.props;

    const componentStyle = {
      ...style,
    };

    const style2 = {
        backgroundColor: hoverColor ? hoverColor : primaryColor,
        border: "3px solid #fff",
        width: "35px",
        height: "35px",
        borderRadius: "17.5px",
        marginLeft: "10px"
    }

    return (
      <div className='color-picker'>
        <Dropdown noDropdownStyle header={
          <div className={`color-picker-button`} style={style2}></div>}
        >
          <ReactColor
            color={componentStyle.backgroundColor}
            onChangeComplete={ this.handleChangeComplete }
            onSwatchHover={ this.handleMouseOver}
            onMouseOut={this.handleMouseOut}/>
        </Dropdown>
      </div>
    );
  }
}

export default ColorPicker;
