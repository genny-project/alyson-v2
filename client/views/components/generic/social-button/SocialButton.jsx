import './socialButton.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
// import FacebookButton from './facebook-button';
import { FacebookLoginButton, TwitterLoginButton, GithubLoginButton, AmazonLoginButton, MicrosoftLoginButton, InstagramLoginButton, LinkedInLoginButton, GoogleLoginButton } from 'react-social-login-buttons';

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

  renderSocialButton = (type) => {

      switch (type) {
          case "facebook":
          return <FacebookLoginButton
              text="Login with Facebook"
              onClick={this.onClickHandler}
          />
          case "twitter":
          return <TwitterLoginButton
              text="Login with Twitter"
              onClick={this.onClickHandler}
          />
          case "linkedin":
          return <LinkedInLoginButton
              text="Login with Linkedin"
              onClick={this.onClickHandler}
          />
          case "amazon":
          return <AmazonLoginButton
              text="Login with Amazon"
              onClick={this.onClickHandler}
          />
          case "instagram":
          return <InstagramLoginButton
              text="Login with Instagram"
              onClick={this.onClickHandler}
          />
          case "microsoft":
          return <MicrosoftLoginButton
              text="Login with Microsoft"
              onClick={this.onClickHandler}
          />
          case "github":
          return <GithubLoginButton
              text="Login with Github"
              onClick={this.onClickHandler}
          />
          case "google":
          return <GoogleLoginButton
              text="Login with Google"
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
