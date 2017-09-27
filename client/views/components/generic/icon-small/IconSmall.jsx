import React, { Component } from 'react';
import { string, number } from 'prop-types';
import './iconsmall.scss';

class IconSmall extends Component {

  constructor(props) {
    super(props);
  }

  static defaultProps = {
    fontSize: 18,
    name: 'android'
  }

  static propTypes = {
    name: string,
    fontSize: number
  }

  render() {
    return (
      <i className="icon material-icons" style={{ fontSize: this.props.size }}>{this.props.name}</i>

    );
  }
}

export default IconSmall;
