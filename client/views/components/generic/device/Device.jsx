import React, { Component } from 'react';
import { any, bool } from 'prop-types';


class Device extends Component {
  static propTypes = {
    children: any,
    isMobile: bool,
    isTablet: bool,
    isDesktop: bool,
    hideMobile: bool,
    hideTablet: bool,
    hideDesktop: bool,
  }

  state = {
  }

  render() {
    const { isMobile, isTablet, isDesktop, hideMobile, hideTablet, hideDesktop, children } = this.props;

    if ( window.getScreenSize() == 'sm' ) {
      if ( hideMobile )
        return <div />;

      if ( isMobile )
        return children;
    }

    if ( window.getScreenSize() == 'md' ) {
      if ( hideTablet )
        return <div />;

      if ( isTablet )
        return children;
    }

    if ( window.getScreenSize() == 'lg' ) {
      if ( hideDesktop )
        return <div />;

      if ( isDesktop )
        return children;
    }

    return <div />;
  }
}

export default Device;
