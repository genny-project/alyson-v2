import './inputCheckbox.scss';
import React, { Component } from 'react';
import { string, object, any, bool } from 'prop-types';
import { Label } from '../';

class InputCheckbox extends Component {

  static defaultProps = {
    className: '',
    checked: false,
  }

  static propTypes = {
    className: string,
    style: string,
    children: any,
    checked: bool,
  }

  state = {
    checked: this.props.checked ? this.props.checked : false,
  }

  handleChange = event => {

    const { validationList } = this.props;
    const value = event.target.checked;

    this.setState(prevState => ({
      checked: !prevState.checked
    }));

    if ( validationList.length > 0 ) {
      const valResult = validationList.every( validation => new RegExp(validation.regex).test( value ));
      this.validateValue(valResult, value);
    } else {
      const valResult = new RegExp(/.*/).test( value );
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
 	  const { className, children, style, name, } = this.props;
    const { checked } = this.state;
    const componentStyle = { ...style, };
    console.log(checked);

    return (
      <div className={`input-checkbox ${className}`}>
        <input type="checkbox" onChange={this.handleChange}/>
        {name ? <Label className="checkbox-label" text={name} checked={checked} /> : null }
      </div>
    );
  }
}

export default InputCheckbox;
