import './inputText.scss';
import React, { Component } from 'react';
import { string, bool, array, object, int, any, func } from 'prop-types';
import { Label, SubmitStatusIcon } from '../';

class InputText extends Component {

  static defaultProps = {
    className: '',
    validationList: [],
    mask: '',
    name: '',
    placeholder: '',
    defaultValue: '',
    readOnly: false,
    optional: false,
    identifier: null
  }

  static propTypes = {
    className: string,
    validationList: array,
    mask: string,
    name: string,
    placeholder: string,
    defaultValue: string,
    readOnly: bool,
    optional: bool,
    onValidation: func,
    identifier: any
  }

  state = {
    validationStatus: null,
    date: new Date(),
    hasChanges: false,
    value: this.props.defaultValue,
    focused: false,
  }

  handleChange = event => {
    if ( this.props.mask ) {
      console.log(this.props.mask);
      var mask = this.props.mask;
      console.log(mask.test(event.target.value));
      if ( mask.test(event.target.value) ) {
        this.setState({
          value: event.target.value,
          hasChanges: true
        });
     }
    } else {
      this.setState({
        value: event.target.value,
        hasChanges: true
      });
    }
  }

  handleFocus = event => {
    this.setState({
      focused: true
    });
  }

  handleBlur = event => {

    const { validationList } = this.props;
    const value = event.target.value;

    this.setState({
      focused: false
    });

    console.log(validationList);

    if ( validationList.length > 0 ) {
      const valResult = validationList.every( validation => new RegExp(validation.regex).test( value ));
      console.log(valResult)
      this.validateValue(valResult, value);
    } else {
      //window.alert("No regex supplied");
      //this.sendAnswer(event.target.value);
      const valResult = new RegExp(/.*/).test( value );
      console.log(valResult);
      this.validateValue(valResult, value);
    }
  }

  validateValue = ( valResult, value ) => {

    if ( valResult ){
      this.validationStyle('success');

      if(this.state.hasChanges) {

        if(this.props.onValidation) this.props.onValidation(value, this.props.identifier);
        this.setState({
            hasChanges: false
        });
      }
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

    const { className, style, name, optional, readOnly, placeholder } = this.props;
    const componentStyle = { ...style, };
    const { validationStatus, date, focused } = this.state;

    return (
      <div className={`input-text ${className} ${validationStatus}`}>
        <div className="input-header">
          {name ? <Label text={name} /> : null }
          {optional ? <Label text="(optional)" /> : null}
          <SubmitStatusIcon status={validationStatus} />
        </div>
        <input
          type="text"
          disabled={readOnly}
          placeholder={placeholder}
          value={this.state.value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          style={ focused ? {borderColor: componentStyle.color} : null }
        />
      </div>
    );
  }
}

export default InputText;
