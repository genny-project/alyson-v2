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

    const { className, style, isOnline } = this.props;
    const componentStyle = { ...style, position: 'relative' };

    /* because backend does not work properly... */
    const isUserOnline = function() {
        return isOnline === true || isOnline == 'true' || isOnline == 'TRUE';
    };

    return (
      <div className={`profile-image-view ${className}`} style={componentStyle}>
        <ImageView {...this.props} style={{ padding: '0' }}/>
        { isUserOnline() === true ? 
          <Status style={{ position: 'absolute', width: '25%', height: '25%', right: '0px', bottom: '0', border: 'solid 1px white' }} color='success' />
        : null }
      </div>
    );
  }
}

export default ProfileImageView;
