import './menuBar.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';
import { IconSmall, Profile, Notifications, Label, ImageView } from '../';

class MenuBar extends Component {
  static defaultProps = {
    className: '',
  }

  static propTypes = {
    className: string,
  }

  render() {
    const { className } = this.props;
    return (
      <div className="menu-bar">
        <div className="menu-bar-left">
          <Label text="Project Title" />
          <ImageView src="https://lh3.googleusercontent.com/6EmDogbGliWNJdXB8NUX4oBxCx3TWZtQpsGdsC63miS1Ia4MrBsXC23GFta5AkC0yBE=w300" />
        </div>
        <div className="menu-bar-right">
          <Notifications />
          <Profile />
          <div className="help">
            <IconSmall name="help" />
          </div>
        </div>
      </div>
    );
  }
}

export default MenuBar;
