import './bucketView.scss';
import React, { Component } from 'react';
import { array, object, any } from 'prop-types';

class BucketView extends Component {
  static propTypes = {
    buckets: array,
    style: object,
    children: any,
  };

  renderBucket( i ) {
    const { children } = this.props;
    let childs = React.Children.toArray(children);
    const bucketChildren = childs.filter(child => {
      return child.props.index != undefined && child.props.index == i;
    });

    return (
      <div key={i} className="bucket-contents">
        {bucketChildren}
      </div>
    );
  }

  render() {
    const { buckets, style } = this.props;

    return (
      <div className="bucket-view" style={style}>
        {buckets.map(( bucket, i ) => (
          <div className="bucket" key={bucket.title}>
            <div className="bucket-title">
              {bucket.title}
            </div>
            <div className="bucket-contents">
              {this.renderBucket( i )}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default BucketView;
