import './inputSlider.scss';
import React, { Component } from 'react';
import { string, object, any, func, array } from 'prop-types';
import Slider, { Range } from 'rc-slider';
import { Label } from '../';

class InputSlider extends Component {

  static defaultProps = {
    className: '',
    validationList: [],
    identifier: null,
    validationStatus: null
  }

  static propTypes = {
    className: string,
    style: object,
    children: any,
    validation: func,
    identifier: any,
    validationStatus: string
  }

  state = {
    timer: null,
    active: null,
    validationStatus: null,
  }

  handleChange = (value) => {
    const { validationList, validation, identifier } = this.props;
    this.setState({ active: true });
    if(validation) {
      clearTimeout(this.state.timer);
      this.state.timer = setTimeout(function(){  
        validation(value, identifier, validationList);
        this.setState({
          active: false,
        });
      }.bind(this), 500);
    }
  }

  render() {
 	  const { className, children, style, name, validationStatus } = this.props;
    const { active } = this.state;
    const componentStyle = { ...style, };


    console.log(this.props);
    console.log(active);

    let handleStyle = [ active ? {borderColor: componentStyle.color} : !validationStatus ? {borderColor: componentStyle.color} : {borderColor: null} ];
    console.log(handleStyle);

    return (
      <div className={`input-slider ${className}`}>
       {name ? <Label className="input-slider-label" text={name} /> : null }
        <Slider
          className={validationStatus}
          min={0}
          max={100}
          defaultValue={50}
          handleStyle={handleStyle}
          trackStyle={[ active ? {backgroundColor: componentStyle.color} : !validationStatus ? {backgroundColor: componentStyle.color} : {backgroundColor: null} ]}
          onAfterChange={this.handleChange}
        />
      </div>
    );
  }
}

export default InputSlider;
