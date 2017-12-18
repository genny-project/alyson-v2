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
    identifier: null,
    validationStatus: null
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
    validation: func,
    identifier: any,
    validationStatus: string
  }

  state = {
    date: new Date(),
    hasChanges: false,
    value: this.props.value,
    focused: false,
  }

  handleChange = event => {
    if ( this.props.mask ) {
      var mask = this.props.mask;
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

  onKeyDown = event => {
    if(event.key == 'Enter') {
        this.handleBlur(event);
    }
  }

  handleBlur = (event) => {

      console.log( "yes" );
    const { validationList, validation, identifier } = this.props;
    const value = event.target.value;
    this.setState({ focused: false });
    if(validation) validation(value, identifier, validationList);
  }

  render() {

    const { className, style, name, optional, readOnly, placeholder, validationStatus, isHorizontal } = this.props;
    const componentStyle = { ...style, };
    const { date, focused, value } = this.state;

    return <div className={`input input-text ${className} ${validationStatus || ''}`}>
        {!isHorizontal ? <div className="input-header">
            {name ? <Label text={name} /> : null}
            {optional ? <Label text="(optional)" /> : null}
            <SubmitStatusIcon status={validationStatus} />
          </div> : null}
        <input type="text" disabled={readOnly} placeholder={placeholder} value={value} onChange={this.handleChange} onBlur={this.handleBlur} onFocus={this.handleFocus} onKeyDown={this.onKeyDown} style={focused ? { borderColor: componentStyle.color } : null} />
      </div>;
  }
}

export default InputText;
