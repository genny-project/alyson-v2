import React, { Component } from 'react';
import { SocialButton } from '../../';
import { object, array, any, string } from 'prop-types';
import { GennyBridge } from 'utils/genny';

class GennySocialButton extends Component {

  state = {
  }

  static defaultProps = {
      type: '',
  }

  static propTypes = {
      type: string,
  };

  onClick = () => {

      GennyBridge.sendBtnClick(this.props.type);
    //   switch(this.props.type) {
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
