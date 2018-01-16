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

    renderChildren() {

        const { children } = this.props;
        if(children.constructor === Array) {
            return <div>{children}</div>
        }

        return children;
    }

    render() {

        const { isMobile, isTablet, isDesktop, hideMobile, hideTablet, hideDesktop, children } = this.props;

        if ( window.getScreenSize() == 'sm' ) {

            if ( hideMobile )
            return null;

            if ( isMobile )
            return this.renderChildren();
        }

        if ( window.getScreenSize() == 'md' ) {

            if ( hideTablet )
            return null;

            if ( isTablet )
            return this.renderChildren();
        }

        if ( window.getScreenSize() == 'lg' ) {

            if ( hideDesktop )
            return null;

            if ( isDesktop )
            return this.renderChildren();
        }

        return null;
    }
}

export default Device;
