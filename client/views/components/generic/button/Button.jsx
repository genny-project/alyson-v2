import './button.scss';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { string, any, func } from 'prop-types';

class Button extends Component {

  static defaultProps = {
    className: '',
    href: '',
    type: '',
    onClick: null,
  }

  static propTypes = {
    children: any.isRequired,
    className: string,
    href: string,
    type: string,
    onClick: func
  }

  onClick = (e) => {

     e.stopPropagation();
     e.nativeEvent.stopImmediatePropagation();
     if(this.props.onClick) this.props.onClick(this);
  }

  render() {

    const { children, type, className, href, onClick, style, buttonStyle, disabled } = this.props;
    const componentStyle = { ...style, };

    const btn = (
      <div className={`button ${className} ${type}`} style={componentStyle}>
        <button disabled={disabled} onClick={this.onClick} style={{ ...buttonStyle }}>{children}</button>
      </div>
    );

    return href
      ? <Link to={href}>{btn}</Link>
      : btn;
  }
}

export default Button;
