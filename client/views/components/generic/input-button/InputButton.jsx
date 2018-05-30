import './inputButton.scss';
import React, { Component } from 'react';
import { string, func, bool, any } from 'prop-types';
import { Button } from 'views/components';

class InputButton extends Component {
  static defaultProps = {
    className: '',
    onClick: () => {},
  }

  static propTypes = {
    className: string,
    onClick: func,
    name: string,
    disabled: bool,
    data: any,
  }

  state = {
  }

  clickHandler = () => {
      this.props.onClick(this, this.props.data);
  }

  render() {
      const { className, name, disabled } = this.props;

      return (
        <div className={`input input-button ${className}`}>
          <Button disable={disabled} onClick={this.clickHandler}>
            <span className='button-text'>{name}</span>
          </Button>
        </div>
      );
  }
}

export default InputButton;
