import './socialButton.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import FacebookButton from './facebook-button';
// import { TwitterLoginButton, GithubLoginButton, AmazonLoginButton, MicrosoftLoginButton, InstagramLoginButton, LinkedInLoginButton, GoogleLoginButton } from 'react-social-login-buttons';

class SocialButton extends Component {

  static defaultProps = {
      buttonType: ''
  }

  static propTypes = {
    style: object,
    buttonType: string
  }

  state = {
  }

  callback = (event) => {
     console.log(event);
  }

  renderSocialButton = (type) => {

      switch (type) {
          case "facebook":
          return <FacebookButton
              redirectUri="http://acrow.outcome-hub.com:8083/social/oauth_callback/&state=secret98053"
              callback={this.callback}
              appId="423902461306952"
              text="My Facebook data"
              onClick={this.onClickHandler}
          />
          default:
          return <p>Unknown button</p>
      }
  }

  onClickHandler = () => {
      console.log(this.props.buttonType);
  }

  render() {

    const { style, buttonType } = this.props;

    return (
      <div className="social-button">
          {this.renderSocialButton(buttonType)}
      </div>
    );
  }
}

export default SocialButton;
