import './inputTextarea.scss';
import React, { Component } from 'react';
import { string, bool } from 'prop-types';

class InputTextarea extends Component {
  static defaultProps = {
    className: '',
    name: '',
  }

  static propTypes = {
    className: string,
    name: string,
  }

  render() {
    const { className, name } = this.props;
    return (
      <div className={`input-textarea ${className}`}>
        {name ? <span>{name}</span> : null }
        <textarea />
      </div>
    );
  }
}

export default InputTextarea;