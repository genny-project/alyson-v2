import './inputSlider.scss';
import React, { Component } from 'react';
import { string, object, any, func, array } from 'prop-types';
import Slider, { Range } from 'rc-slider';
import { Label } from '../';

class InputSlider extends Component {

  static defaultProps = {
    className: '',
    validationList: [],

  }

  static propTypes = {
    className: string,
    style: object,
    children: any,
    onValidation: func,
    identifier: any,
    validationList: array,
  }

  state = {
    timer: null,
    active: null,
    validationStatus: null,
  }

  handleChange = value => {

    // console.log("value: ", value);
    const { validationList } = this.props;
    // console.log("valList", validationList);

    this.setState({
      active: true,
    });

    if ( validationList.length > 0 ) {
      const valResult = validationList.every( validation => new RegExp(validation.regex).test( value ));
      //console.log("valresult: ", valResult);
      this.validateValue(valResult, value);
    } else {
      //window.alert("No regex supplied");
      //this.sendAnswer(event.target.value);
      const valResult = new RegExp(/.*/).test( value );
      console.log("valresult: ", valResult);
      this.validateValue(valResult, value);
    }
  }

  validateValue = ( valResult, value ) => {
    
    if ( valResult ){
      
      clearTimeout(this.state.timer);
      this.state.timer = setTimeout(function(){ 
        
        if(this.props.onValidation) {
          this.validationStyle('success');
          this.props.onValidation(value, this.props.identifier);
        } else {
          this.validationStyle('error');
        }

        this.setState({
          active: false,
        });

      }.bind(this), 500);        
      
    } else {
      this.validationStyle('error');
    }
  }

  validationStyle = (resultString) => {
    this.setState({
      validationStatus: resultString,
    });
  }


  render() {
 	  const { className, children, style, name } = this.props;
    const { validationStatus, active } = this.state;
    const componentStyle = { ...style, };

    return (
      <div className={`input-slider ${className}`}>
       {name ? <Label className="input-slider-label" text={name} /> : null }
        <Slider
          className={validationStatus}
          min={0}
          max={100}
          defaultValue={50}
          handleStyle={[ active ? {borderColor: componentStyle.color} : !validationStatus ? {borderColor: componentStyle.color} : {borderColor: null} ]}
          trackStyle={[ active ? {backgroundColor: componentStyle.color} : !validationStatus ? {backgroundColor: componentStyle.color} : {backgroundColor: null} ]}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default InputSlider;
