import './socialButton.scss';
import React, { Component } from 'react';
import { string, object, func, any } from 'prop-types';
import FacebookButton from './facebook-button';
// import { TwitterLoginButton, GithubLoginButton, AmazonLoginButton, MicrosoftLoginButton, InstagramLoginButton, LinkedInLoginButton, GoogleLoginButton } from 'react-social-login-buttons';

class SocialButton extends Component {

  static defaultProps = {
      buttonType: '',
      onClick: () => {}
  }

  static propTypes = {
    style: object,
    buttonType: string,
    onClick: func
  }

  state = {
  }

  callback = (event) => {
     console.log(event);
  }

  renderSocialButton = (type) => {

      switch (type) {
          case "facebook":
          return <FacebookButton onClick={this.props.onClick} />
          default:
          return <p>Unknown button</p>
      }
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
