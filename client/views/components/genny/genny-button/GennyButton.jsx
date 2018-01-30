import './gennyButton.scss';
import React, { Component } from 'react';
import { string, any, object} from 'prop-types';
import { Button } from 'views/components';
import { GennyBridge } from 'utils/genny';

class GennyButton extends Component {

  static defaultProps = {
    buttonCode: null,
    value: null,
  }

  static propTypes = {
    buttonCode: string,
    value: object,
    children: any,
    buttonComponentStyle: object,
    style: object,
  };

  handleClick = () => {

    if(this.props.buttonCode) {

        const isString = (this.props.value && this.props.value.constructor == String)
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

  render() {
    const { children, style, buttonComponentStyle, ...rest } = this.props;
    const componentStyle = { ...style, };

    return (
      <div className="genny-button" style={componentStyle}>
        <Button {...rest} onClick={this.handleClick} style={ {...buttonComponentStyle, height: componentStyle.height }}>
          {children}
        </Button>
      </div>
    );
  }
}

export default GennyButton;
