import './inputCheckbox.scss';
import React, { Component } from 'react';
import { string, object, any, bool, func } from 'prop-types';
import { Label } from '../';

class InputCheckbox extends Component {

  static defaultProps = {
    className: '',
    checked: false,
    identifier: null,
    validationStatus: null
  }

  static propTypes = {
    className: string,
    style: string,
    children: any,
    checked: bool,
    validation: func,
    identifier: any,
    validationStatus: string
  }

  state = {
    checked: this.props.checked ? this.props.checked : false,
  }

  handleChange = (event) => {
    const { validationList, validation, identifier } = this.props;
    const value = event.target.checked;
    this.setState(prevState => ({ checked: !prevState.checked }));
    if(validation) {
      clearTimeout(this.state.timer);
      this.state.timer = setTimeout(function(){  
        validation(value, identifier, validationList);
      }.bind(this), 1000);
    }
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
