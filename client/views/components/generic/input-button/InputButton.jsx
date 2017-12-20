import './inputButton.scss';
import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { Button, IconSmall, Label } from '../';

class InputButton extends Component {

  static defaultProps = {
    className: '',
    onClick: () => {},
  }

  static propTypes = {
    className: string,
    onClick: func,
    btn_code: string
  }

  state = {

  }

  clickHandler = () => {
    this.props.onClick(this);
  }

  render() {

      const { className, style, name, optional, readOnly, placeholder, validationStatus, isHorizontal } = this.props;
      const componentStyle = { ...style, };
      const { date, focused } = this.state;

      return (
        <div className={`input input-button ${className}`}>
          <Button onClick={this.clickHandler}>
            <span className='button-text'>{name}</span>
          </Button>
        </div>
      );
  }
}

export default InputButton;
