import React, { Component } from 'react';
import { SocialButton } from '../../';
import { object, array, any, string } from 'prop-types';
import { GennyBridge } from 'utils/genny';

class GennySocialButton extends Component {

  state = {
  }

  static defaultProps = {
      buttonType: '',
  }

  static propTypes = {
      buttonType: string,
  };

  onClick = () => {

      GennyBridge.sendBtnClick(this.props.buttonType);
    //   switch(this.props.buttonType) {
    //       case "facebook":
    //       break;
    //       default: console.log("button not recognized");
    //   }
  }

  render() {

    return (
      <div className="genny-social-button">
        <SocialButton {...this.props}  onClick={this.onClick}/>
      </div>
    );
  }
}

export default GennySocialButton;
