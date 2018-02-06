import React, { Component } from 'react';
import { string, number, bool, object, func } from 'prop-types';
import './iconsmall.scss';

class IconSmall extends Component {

  static defaultProps = {
    className: '',
    size: 24,
    name: 'android',
    text: null,
    fa: false,
  }

  static propTypes = {
    className: string,
    name: string,
    fontSize: number,
    text: string,
    fa: bool,
    size: string,
    onClick: func,
    onMouseOver: func,
    onMouseOut: func,
    style: object,
  }

  render() {
    const { className, size, name, onClick, onMouseOver, onMouseOut, text, fa, style } = this.props;

    let iconStyle = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    };

    let iconPadding = `${size / 6 }px 0`;

    return (
        <span style={text ? iconStyle : null} className={`icon-small ${className}`}>
            <i
              className={`icon ${fa ? 'fa fa-' + name : 'material-icons'}`}
              onClick={onClick}
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              style={{ padding: iconPadding, ...style, fontSize: size, }}
            >
              {fa ? null : name}
            </i>
            {
                text ? <span style={{ fontSize: size, paddingLeft: '5px', }}>{text}</span> : null
            }
        </span>
    );
  }
}

export default IconSmall;
