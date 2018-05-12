import './gennyPasscode.scss';
import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { Passcode, Spinner, GennyButton } from 'views/components';
import { GennyBridge } from 'utils/genny';
import { Fade, Slide } from 'views/utils/animations';

class GennyPasscode extends Component {

  static defaultProps = {
  }

  static propTypes = {
    style: object,
    className: string,
  };

  state = {
    in: false
  };


  handleComplete = (value) => {

    // GennyBridge.sendBtnClick('BTN_CLICK', {
    //   code: 'EVT_PASSCODE_VALIDATION',
    //   value: value
    // });

    const { validationList, validation, className, onBlur } = this.props;

    if(onBlur) onBlur();
    if(validation) validation(value, className, validationList);

    // this.state.timer = setTimeout(() => {
    //   this.setState({
    //     answerSent: true
    //   });
    //
    //   this.state.timer = setTimeout(() => {
    //     this.setState({
    //       answerSent: false
    //     });
    //   }, 3000);
    // }, 500);
  }

  handleClick = () => {
    this.setState({
      answerSent: false
    });
  }

  toggleEnterState = () => {
    this.setState({ in: true });
  }

  render() {
    const { className, style, ...rest } = this.props;
    const { answerSent } = this.state;
    const componentStyle = { ...style };

    //console.log(answerSent);

    return (
      <div className={`genny-passcode ${className}`} style={componentStyle}>

        { answerSent ?
          <Spinner />
          :
          <Passcode
            {...rest}
            onComplete={this.handleComplete}
            disabled={answerSent}
          />
        }

        {/* <Fade inProp={answerSent} >
          <Slide inProp={answerSent} >
            <Spinner />
          </Slide>
        </Fade> */}

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
          buttonStyle= {{ height: '50px', width: "50%", "margin-left": "25%"}}
          children="RESEND VERIFICATION CODE"
        />
      </div>
    );
  }
}

export default GennyPasscode;
