import './layoutNotFound.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';

class LayoutNotFound extends Component {
  static propTypes = {
    layout: string,
  };

  render() {
    const { layout } = this.props;

    return (
      <div className="layout-not-found">
        <i className="material-icons">error</i>
        <h1>Whoops!</h1>
        <h2>Layout not found</h2>
        <p><b>Layout:</b> {layout}</p>
      </div>
    );
  }
}

export default LayoutNotFound;
