import React, { Component } from 'react';
import { string } from 'prop-types';

class TitleBar extends Component {
  static propTypes = {
    title: string,
  };

  render() {
    const { title } = this.props;

    return (
      <div className="title-bar">
        {title}
      </div>
    );
  }
}

export default TitleBar;
