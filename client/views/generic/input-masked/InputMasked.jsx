import './inputMasked.scss';
import React, { Component } from 'react';
import { string, array, bool } from 'prop-types';
import MaskedInput from 'react-text-mask';

class InputMasked extends Component {
  static defaultProps = {
    className: '',
    type: '',
    name: '',
    mask: [],
    placeHolder: '',
    guide: true,
    pipe: '',
  }

  static propTypes = {
    className: string,
    type: string,
    name: string,
    mask: array,
    placeHolder: string,
    guide: bool,
    pipe: string
  }

  render() {
    const { className, type, name, mask, placeHolder, guide, pipe } = this.props;
    return (
      <div className={`input-masked ${className}`}>
        <span>{name}</span>
        <MaskedInput mask={mask} placeholder={placeHolder} guide={guide} pipe={pipe} />
      </div>
    );
  }
}

export default InputMasked;