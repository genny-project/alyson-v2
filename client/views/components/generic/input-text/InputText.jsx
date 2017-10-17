import './inputText.scss';
import React, { Component } from 'react';
import { string, bool, array } from 'prop-types';
import { Label, SubmitStatusIcon } from '../';

class InputText extends Component {
  static defaultProps = {
    className: '',
    name: '',
    readOnly: false,
    defaultValue: '',
    optional: false,
    placeholder: '',
    mask: null,
    validation: '',
  }

  static propTypes = {
    className: string,
    srcCode: string,
    targetCode: string,
    attributeCode: string,
    dataType: string,
    name: string,
    mask: string,
    validationlist: array,
    readOnly: bool,
    optional: bool,
    expiry: string,
    placeholder: string,
  }

  state = {
    value: '',
    mask: this.props.mask,
    validationlist: this.props.validationlist,
    validationClass: '',
    isValid: null,
    submitStatus: null,
    date: new Date(),
  }

  handleChange = event => {
    if ( this.state.mask ) {
      console.log(this.state.mask);
      var mask = this.state.mask;
      console.log(mask.test(event.target.value));
      if ( mask.test(event.target.value) ) {
        this.setState({
          value: event.target.value
        })
     }
    } else {
      this.setState({
        value: event.target.value
      })
    }
  }

  handleBlur = event => {
    var valList = this.state.validationlist;
    valList.forEach((element) => {
      const valItem = element.validation;
      if ( valItem.test(event.target.value) ){
        this.setState({
          isValid: true,
          validationClass: 'success',
          submitStatus: 'sending',
        });
        setTimeout(function(){ this.setState({ submitStatus: 'success' }); }.bind(this), 3000);

      } else {
        this.setState({
          isValid: false,
          validationClass: 'error',
          submitStatus: 'sending',
        });
        setTimeout(function(){ this.setState({ submitStatus: 'error' }); }.bind(this), 3000);
      }
    });
  }


  render() {
    const { className, name, readOnly, placeholder, optional} = this.props;
    const { validationClass, submitStatus, date } = this.state;

    return (
      <div className={`input-text ${className} ${validationClass}`}>
        <div className="input-header">
          {name ? <Label text={name} /> : null }
          {optional ? <Label text="(optional)" /> : null}
          <SubmitStatusIcon status={submitStatus} />
        </div>
        <input
          type="text"
          disabled={readOnly}
          placeholder={placeholder}
          value={this.state.value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
      </div>
    );
  }
}

export default InputText;