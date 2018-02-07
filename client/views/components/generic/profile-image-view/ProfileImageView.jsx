import './ProfileImageView.scss';
import React, { Component } from 'react';
import { string, object, any, bool } from 'prop-types';
import { ImageView, Status } from 'views/components';

class ProfileImageView extends Component {

  static defaultProps = {
    className: '',
    isOnline: false,
  }

  static propTypes = {
    className: string,
    style: object,
    children: any,
    isOnline: bool,
  }

  state = {

  }

  render() {

    const { className, children, style, isOnline } = this.props;
    const {  } = this.state;
    const componentStyle = { ...style, "position": "relative" };

    return (
      <div className={`profile-image-view ${className}`} style={componentStyle}>
        <ImageView {...this.props} />
        <Status style={{ "position": "absolute", "right": "-3px", "bottom": "-4px" }} color={ isOnline === true ? "success" : "urgent" } />
      </div>
    );
  }
}

export default ProfileImageView;
