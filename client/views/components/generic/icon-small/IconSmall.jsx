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
    text: string,
    fa: bool,
    size: number,
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
        ...style,
    };

    let iconPadding = `${size / 6 }px 0`;

    return (
        <span style={text ? iconStyle : null} className={`icon-small ${className}`}>
            <i
              className={`icon ${fa ? 'fa fa-' + name : 'material-icons'}`}
              onClick={onClick}
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              style={{ padding: iconPadding, fontSize: `${size}px`, ...style, }}
            >
              {fa ? null : name}
            </i>
            {
                text ? <span style={{ paddingLeft: '5px', fontSize: `${size}px` }}>{text}</span> : null
            }
        </span>
    );
  }
}

export default IconSmall;
