import React, { Component } from 'react';
import { BaseEntityQuery } from 'utils/genny';
import { string } from 'prop-types';
import './gennyCounter.scss';

class GennyCounter extends Component {
  static propTypes = {
    root: string,
    title: string
  };

  static defaultProps = {
    title: ''
  };

  fetchNumbers = () => {
    const { root } = this.props;

    const data = BaseEntityQuery.getEntityChildren(root);
    if (data) {
      return data.length;
    } else {
      return null;
    }
  };

  render() {
    const { title } = this.props;
    return (
      <div className="genny-counter">
        <h1 className="genny-counter-number"> {this.fetchNumbers()} </h1>
        <p className="genny-counter-title"> {title}</p>
      </div>
    );
  }
}

export default GennyCounter;
