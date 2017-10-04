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
    name: 'android'
  }

  static propTypes = {
    className: string,
    name: string,
    fontSize: number
  }

  render() {
    const { className, size, name, onClick } = this.props;
    return (
      <i className={`icon material-icons ${className} `} onClick={onClick} style={{ fontSize: size }}>{name}</i>

    );
  }
}

export default IconSmall;
