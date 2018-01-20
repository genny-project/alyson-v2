import './inputTextarea.scss';
import React, { Component } from 'react';
import { string, func, any, array } from 'prop-types';
import { Label } from 'views/components';

class InputTextarea extends Component {
  static defaultProps = {
    className: '',
    name: '',
    identifier: null,
    validationStatus: null
  }

  static propTypes = {
    className: string,
    name: string,
    validation: func,
    identifier: any,
    validationStatus: string,
    validationList: array,
    placeholder: string,
    mask: any,
  }

  state = {
    hasChanges: false,
    value: this.props.placeholder,
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

  handleFocus = () => {
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
    const { validationList, validation, identifier,  } = this.props;
    const value = event.target.value;
    this.setState({ focused: false });
    if(validation) validation(value, identifier, validationList);
  }

  render() {
    const { className, name, validationStatus } = this.props;
    const { value } = this.state;
    
    
    return (
      <div className={`input-textarea ${className} ${validationStatus}`}>
         {name ? <Label>{name}</Label> : null }
        <textarea 
          value={value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onKeyDown={this.onKeyDown}
        />
      </div>
    );
  }
}

export default InputTextarea;