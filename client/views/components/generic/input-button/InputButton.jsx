import './inputButton.scss';
import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { Button, IconSmall, Label } from '../';

class InputButton extends Component {
    
  static defaultProps = {
    className: '',
    onClick: () => {},
    btn_code: 'FACEBOOK'
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
        <div className={`input-button facebook`}>
          <Button onClick={this.clickHandler}>
            <span className='button-text'></span>
          </Button>
        </div>
      );
  }
}

export default InputButton;
