import './gennyPasscode.scss';
import React, { Component } from 'react';
import { string, object, bool } from 'prop-types';
import { Passcode, Spinner, GennyButton } from 'views/components';
import { GennyBridge } from 'utils/genny';

class GennyPasscode extends Component {

  static defaultProps = {
    autofocus: false
  }

  static propTypes = {
    style: object,
    className: string,
    autofocus: bool
  };

  state = {
  };


  handleComplete = (value) => {
    
    GennyBridge.sendBtnClick('BTN_CLICK', {
      code: 'EVT_PASSCODE_VALIDATION',
      value: value
    });

    this.state.timer = setTimeout(() => {
      this.setState({
        answerSent: true
      });

      this.state.timer = setTimeout(() => {
        this.setState({
          answerSent: false
        });
      }, 5000);
    }, 500);
  }

  handleClick = () => {
    this.setState({
      answerSent: false
    });
  }

  render() {
    const { className, style, autofocus } = this.props;
    const { answerSent } = this.state;
    const componentStyle = { ...style };

    return (
      <div className={`genny-passcode ${className}`} style={componentStyle}>
        { answerSent ?
          <Spinner />
          : 
          <Passcode
            onComplete={this.handleComplete}
            disabled={answerSent}
            autofocus={autofocus}
          />
        }
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
