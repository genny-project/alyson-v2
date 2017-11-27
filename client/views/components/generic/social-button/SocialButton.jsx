import './socialButton.scss';
import React, { Component } from 'react';
import { string, object, func, any } from 'prop-types';
import FacebookButton from './facebook-button';
// import { TwitterLoginButton, GithubLoginButton, AmazonLoginButton, MicrosoftLoginButton, InstagramLoginButton, LinkedInLoginButton, GoogleLoginButton } from 'react-social-login-buttons';

class SocialButton extends Component {

  static defaultProps = {
      type: '',
      onClick: () => {}
  }

  static propTypes = {
    style: object,
    type: string,
    onClick: func
  }

  state = {

  }

  onClick = () => {

      if(this.props.onClick) {
          this.props.onClick(this);
      }
  }

  renderSocialButton = (type) => {

      switch (type) {
          case "facebook":
          return <FacebookButton onClick={this.onClick} />
          default:
          return <p>Unknown button</p>
      }
  }

  render() {

    const { style, type } = this.props;

    return (
      <div className="social-button">
          {this.renderSocialButton(type)}
      </div>
    );
  }
}

export default SocialButton;
