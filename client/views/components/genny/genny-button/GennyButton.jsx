import './gennyButton.scss';
import React, { Component } from 'react';
import { string, any, object, func, number } from 'prop-types';
import { Button } from 'views/components';
import { GennyBridge } from 'utils/genny';

class GennyButton extends Component {

  static defaultProps = {
    buttonCode: null,
    value: null,
    confirmation: null,
    animationDelay: 3000
  }

  static propTypes = {
    buttonCode: string,
    value: object,
    children: any,
    buttonComponentStyle: object,
    buttonStyle: object,
    style: object,
    className: string,
    confirmation: string,
    onClick: func,
    animationDelay: number
  };

  state = {
    isAnimated: false
  };

  componentWillUnmount() {
    this.state.timer = null;
  }

  handleClick = () => {
    this.setState({
      isAnimated: true
    }, () => {
      this.state.timer = setTimeout(() => {
        this.setAnimationStop();
      }, this.props.animationDelay);
    });

    if(this.props.buttonCode) {

        const isString = (this.props.value && this.props.value.constructor == String);
        if(isString == false) {
            this.props.value.userCode = GennyBridge.getUser();
        }

        let btnValue = (this.props.value && this.props.value.constructor == String) ? this.props.value : JSON.stringify(this.props.value);

      GennyBridge.sendBtnClick('BTN_CLICK', {
        code: this.props.buttonCode,
        value: btnValue || null,
      });
      
      if(this.props.onClick) {
          this.props.onClick(this);
      }
    }
  }

  handleConfirmation = (confirmation) => {
    
    this.setState({
      isAnimated: true
    }, () => {
      this.state.timer = setTimeout(() => {
        this.setAnimationStop();
      }, this.props.animationDelay);
    });

    let shouldFire = confirm(confirmation);

    if (shouldFire == true) {
      this.handleClick();
    } else {
      this.setState({
        isAnimated: false
      });
    }  
  }

  setAnimationStop = () => {
    
    this.setState({
      isAnimated: false
    }); 
  }

  render() {
    const { children, className, style, buttonComponentStyle, buttonStyle, disabled, confirmation, ...rest } = this.props;
    const componentStyle = { ...style };
    
    const clickEvent = confirmation ? () => this.handleConfirmation(confirmation) : this.handleClick;

    let buttonWidth = buttonStyle && buttonStyle.width ? buttonStyle.width : '100%';
    if (this.state.isAnimated) {
      if (buttonStyle && buttonStyle.height) {
        buttonWidth = buttonStyle.height;
      }
      else if (componentStyle && componentStyle.height) {
        buttonWidth = componentStyle.height; 
      }
    }
    return (
      <div className={`genny-button ${className} ${this.state.isAnimated ? 'animate' : ''}`} style={componentStyle}>
        <Button
          {...rest}
          disabled={disabled}
          onClick={clickEvent}
          buttonStyle={{ ...buttonStyle, width: buttonWidth }}
          style={ {...buttonComponentStyle, height: componentStyle.height }}
        >
        {
          this.state.isAnimated ?
            <div className={'button-spinner'} />
          :
            children
        }
        </Button>
      </div>
    );
  }
}

export default GennyButton;
