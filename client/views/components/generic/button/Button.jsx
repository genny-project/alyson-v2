import './button.scss';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { string, any, func } from 'prop-types';

class Button extends Component {
  static defaultProps = {
    className: '',
    href: '',
    type: '',
    onClick: () => {},
  }

  static propTypes = {
    children: any.isRequired,
    className: string,
    href: string,
    type: string,
    onClick: func,
  }

  render() {
    const { children, type, className, href, onClick, style } = this.props;
    const componentStyle = { ...style, };

    const btn = (
      <div className={`button ${className} ${type}`} style={componentStyle}>
        <button onClick={onClick} >{children}</button>
      </div>
    );

    return href
      ? <Link to={href}>{btn}</Link>
      : btn;
  }
}

export default Button;
