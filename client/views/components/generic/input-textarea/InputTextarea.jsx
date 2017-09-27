import './inputTextarea.scss';
import React from 'react';
import { GennyComponent } from '../genny-component';
import { string, bool } from 'prop-types';

class InputTextarea extends GennyComponent {
  static defaultProps = {
    className: '',
    name: '',
    label: '',
  }

  static propTypes = {
    className: string,
    name: string,
    label: string,
  }

  render() {
    const { className, name, label } = this.props;
    return (
      <div className={`input-textarea ${className}`}>
         {label ? <Label>{label}</Label> : null }
        <textarea />
      </div>
    );
  }
}

export default InputTextarea;