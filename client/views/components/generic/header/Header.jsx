import './header.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';

class Header extends Component {
  static defaultProps = {
    className: '',
    style: {},
  }

  static propTypes = {
    className: string,
    style: object,
    children: any,
  }

  state = {
  }

  render() {

    const { className, style } = this.props;

    const componentStyle = {
      ...style,
    };

    return (

      <div className={'header'} style={componentStyle}>
        <div className="header-container">
            <div className="header-left">
            </div>
             <div className="header-center">
             </div>
            <div className="header-right">
            </div>
        </div>

      </div>
    );
  }
}

export default Header;
