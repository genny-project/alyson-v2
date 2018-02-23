import './gennyPasscode.scss';
import React, { Component } from 'react';
import { string, any, object, func, number } from 'prop-types';
import { Passcode, Spinner, GennyButton } from 'views/components';
import { GennyBridge } from 'utils/genny';

class GennyPasscode extends Component {

  static defaultProps = {
    buttonCode: null,
    value: null,
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
  };


  handleComplete = (value) => {
    
    GennyBridge.sendBtnClick('BTN_CLICK', {
      code: 'EVT_PASSCODE_VALIDATION',
      value: value
    });

    this.setState({
      answerSent: true
    });
  }

  handleClick = () => {
    this.setState({
      answerSent: false
    });
  }

  render() {
    const { className, style,  } = this.props;
    const { answerSent } = this.state;
    const componentStyle = { ...style };

    return (
      <div className={`genny-passcode ${className}`} style={componentStyle}>
        <Passcode
          onComplete={this.handleComplete}
          disabled={answerSent}
        />
        { answerSent ? <Spinner /> : null}
        <GennyButton
          buttonCode="BTN_RESEND_VERIFICATION_SMS"
          onClick={this.handleClick}
          style={{
            margin:'0 auto',
            width: '80%',
            height:'50px',
            fontSize:'13px'
          }}
          type="confirm"
          buttonStyle= {{ height: '50px'}}
          children="RESEND VERIFICATION CODE"
        />
      </div>
    );
  }
}

export default GennyPasscode;
