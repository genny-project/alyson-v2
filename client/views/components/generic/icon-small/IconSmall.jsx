import React, { Component } from 'react';
import { string, number, bool, object, func } from 'prop-types';
import './iconsmall.scss';

class IconSmall extends Component {

  static defaultProps = {
    className: '',
    fontSize: 18,
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
    const { className, size, name, onClick, onMouseOver, onMouseOut, text, fa,style } = this.props;

    let iconStyle = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    };

    return (
        <span style={text ? iconStyle : null} className={`icon-small ${className}`}>
            <i
              className={`icon ${fa ? 'fa fa-' + name : 'material-icons'}`}
              onClick={onClick}
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              style={{ padding: `${size / 7 }px 0`, ...style, fontSize: size, }}
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
