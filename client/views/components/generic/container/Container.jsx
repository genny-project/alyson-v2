import './container.scss';
import React, { Component } from 'react';
import { any, string } from 'prop-types';
class Container extends Component {
  static defaultProps = {
    className: '',
  }

  static propTypes = {
    children: any,
    className: string,
  }

  render() {
    return (
      <div className={`container ${this.props.className}`}>
        {this.props.children}
      </div>
    );
  }
}

export default Container;
