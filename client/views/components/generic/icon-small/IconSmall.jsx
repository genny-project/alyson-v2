import React, { Component } from 'react';
import { string, number } from 'prop-types';
import './iconsmall.scss';

class IconSmall extends Component {

  constructor(props) {
    super(props);
  }

  static defaultProps = {
    className: '',
    fontSize: 18,
    name: 'android',
    text: null,
  }

  static propTypes = {
    className: string,
    name: string,
    fontSize: number,
    text: string,
  }

  render() {
    const { className, size, name, onClick, text } = this.props;

    let iconStyle = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    };

    return (
        <span style={text ? iconStyle : null} className={`icon-small ${className}`}>
            <i className={`icon material-icons `} onClick={onClick} style={{ fontSize: size, }}>{name}</i>
            {
                text ? <span style={{ fontSize: size, paddingLeft: "10px", }}>{text}</span> : null
            }
        </span>
    );
  }
}

export default IconSmall;
