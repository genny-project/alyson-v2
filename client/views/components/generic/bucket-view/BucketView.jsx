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
      return child.props.answerGroup.index != undefined && child.props.answerGroup.index == i;
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
            <div className="bucket-title sticky">
              {bucket.title}
            </div>
            <div className="bucket-content">
              {this.renderBucket( i )}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default BucketView;
