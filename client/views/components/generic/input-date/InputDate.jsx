import './inputDate.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import { Label, InputDropdown2 } from '../';

class InputDate extends Component {

  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
    style: string,
  }

  state = {
  }

  render() {
 	  const { className, style, items, ask, } = this.props;
    const {  } = this.state;
    const componentStyle = { ...style, };
    return (
      <div className={`input-date ${className}`}>
        {ask.name ? <Label className="input-date-label" text={ask.name} /> : null }
        <InputDropdown2 items={items} className="input-date-dropdown day" />
        <InputDropdown2 items={items} className="input-date-dropdown month"/>
        <InputDropdown2 items={items} className="input-date-dropdown year"/>
      </div>
    );
  }
}

export default InputDate;
