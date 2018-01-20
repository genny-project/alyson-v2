import './socialButton.scss';
import React, { Component } from 'react';
import { string, object, func, } from 'prop-types';
import FacebookButton from './facebook-button';

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
          case 'facebook':
          return <FacebookButton onClick={this.onClick} />;
          default:
          return <p>Unknown button</p>;
      }
  }

  render() {

    const { type } = this.props;

    return (
      <div className="social-button">
          {this.renderSocialButton(type)}
      </div>
    );
  }
}

export default SocialButton;
