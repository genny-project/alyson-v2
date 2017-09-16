import './bucketView.scss';
import React, { Component } from 'react';
import { array, object } from 'prop-types';

class BucketView extends Component {
  static propTypes = {
    buckets: array,
    style: object,
  };

  render() {
    const { buckets, style } = this.props;

    return (
      <div className="bucket-view" style={style}>
        {buckets.map(( bucket, i ) => (
          <div className="bucket" key={bucket.title}>
            <div className="bucket-title">
              {bucket.title}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default BucketView;
