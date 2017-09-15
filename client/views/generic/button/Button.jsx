import './button.scss';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { string } from 'prop-types';

class Button extends Component {
  static defaultProps = {
    className: '',
    href: '',
    type: '',
  }

  static propTypes = {
    children: string.isRequired,
    className: string,
    href: string,
    type: string,
  }

  render() {
  	const { children, type, className, href } = this.props;
    const btn = (
      <div className={`button ${className}`}>
        <button className={type} >{children}</button>
      </div>
    );

    return href
      ? <Link to={href}>{btn}</Link>
      : btn;
  }
}

export default Button;