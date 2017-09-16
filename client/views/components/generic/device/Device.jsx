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
    width: window.innerWidth,
  }

  componentWillMount() {
    window.addEventListener( 'resize', event => {
      this.setState({ width: event.target.innerWidth });
    });
  }

  render() {
    const { isMobile, isTablet, isDesktop, hideMobile, hideTablet, hideDesktop, children } = this.props;
    const { width } = this.state;

    if ( width < 768 ) {
      if ( hideMobile )
        return <div />;

      if ( isMobile )
        return children;
    }

    if ( width >= 768 && width < 992 ) {
      if ( hideTablet )
        return <div />;

      if ( isTablet )
        return children;
    }

    if ( width >= 992 ) {
      if ( hideDesktop )
        return <div />;

      if ( isDesktop )
        return children;
    }

    return <div />;
  }
}

export default Device;
