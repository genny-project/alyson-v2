import './inputTextarea.scss';
import React, { Component } from 'react';
import { string, func, any, array, bool } from 'prop-types';
import { Label, SubmitStatusIcon } from 'views/components';

class InputTextarea extends Component {
  static defaultProps = {
    className: '',
    name: '',
    identifier: null,
    validationStatus: null,
    mandatory: false,
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
    hideHeader: bool,
    isHorizontal: bool,
    onBlur: func,
    onFocus: func,
    mandatory: bool,
    handleOnChange: func
  }

  state = {
    hasChanges: false,
    value: this.props.placeholder,
    focused: false,
  }

  handleChange = event => {

    const { handleOnChange } = this.props;
    const value = event.target.value;

    if(handleOnChange) handleOnChange(value);
}

  handleFocus = () => {

      if(this.props.onFocus) {
          this.props.onFocus();
      }

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

      if(this.props.onBlur) {
          this.props.onBlur();
      }

    const { validationList, validation, identifier} = this.props;
    const value = event.target.value;
    this.setState({ focused: false });
    if(validation) validation(value, identifier, validationList);
  }

  render() {
    const { className, name, validationStatus, isHorizontal, hideHeader, mandatory } = this.props;
    const { value } = this.state;


    return (
      <div className={`input-textarea ${className} ${validationStatus}`}>
        {
            !isHorizontal && !hideHeader ?
            <div className="input-header">
                {name ? <Label text={name} /> : null}
                {mandatory? <Label className='input-label-required' textStyle={ !validationStatus || validationStatus == 'error' ? {color: '#cc0000'} : null } text="*  required" /> : null}
                <SubmitStatusIcon status={validationStatus} style={{marginLeft: '5px'}}/>
            </div> :
            null
        }
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
