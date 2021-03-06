import './button.scss';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { string, any, func, object, bool } from 'prop-types';

class Button extends Component {

  static defaultProps = {
    className: '',
    href: '',
    type: '',
    onClick: null,
    disabled: false
  }

  static propTypes = {
    children: any,
    className: string,
    href: string,
    type: string,
    onClick: func,
    style: object,
    buttonStyle: object,
    disabled: bool,
    identifier: string,
  }

  onClick = (e) => {

     e.stopPropagation();
     e.nativeEvent.stopImmediatePropagation();
     if(this.props.onClick) this.props.onClick(this);
  }

  render() {

    const { children, type, className, href, style, buttonStyle, disabled, identifier } = this.props;
    const componentStyle = { ...style, };

    const btn = (
      <div className={`button ${className} ${type} ${disabled ? 'disabled' : ''}`} style={componentStyle}>
        <button className={identifier} disabled={disabled} onClick={this.onClick} style={{ ...buttonStyle }}>{children ? children : null}</button>
      </div>
    );

    return href
      ? <Link to={href} target="_blank">{btn}</Link>
      : btn;
  }
}

export default Button;
