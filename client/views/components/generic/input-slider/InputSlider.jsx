import './inputSlider.scss';
import 'rc-slider/assets/index.css';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import Slider, { Range } from 'rc-slider';
import {  } from '../';

class InputSlider extends Component {

  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
    style: string,
    children: any,
  }

  state = {
  }

  render() {
 	  const { className, children, style } = this.props;
    const {  } = this.state;
    const componentStyle = { ...style, };

    return (
      <div className={`input-slider ${className}`}>
        <Slider min={0} max={100} defaultValue={3} />
      </div>
    );
  }
}

export default InputSlider;
