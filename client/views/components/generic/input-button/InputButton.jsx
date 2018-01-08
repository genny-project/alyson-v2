import './inputButton.scss';
import React, { Component } from 'react';
import { string, func } from 'prop-types';
import { Button, IconSmall, Label } from 'views/components';

class InputButton extends Component {

  static defaultProps = {
    className: '',
    onClick: () => {},
  }

  static propTypes = {
    className: string,
    onClick: func,
  }

  state = {
      shouldAnimate: false,
  }

  clickHandler = () => {

      if(this.props.animate) {
          this.setState({
              shouldAnimate: true,
          })
      }

      this.props.onClick(this, this.props.data);
  }

  render() {

      const { className, style, name, optional, readOnly, placeholder, validationStatus, isHorizontal, disabled, animate } = this.props;
      const componentStyle = { ...style, };
      const { date, focused, shouldAnimate } = this.state;

      return (
        <div className={`input input-button ${className} ${shouldAnimate ? 'animate' : ''}`}>
          <Button disable={disabled} onClick={this.clickHandler}>
            <span className='button-text'>{shouldAnimate ? null : name}</span>
          </Button>
        </div>
      );
  }
}

export default InputButton;
